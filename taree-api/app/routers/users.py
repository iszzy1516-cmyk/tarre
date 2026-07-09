from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User, Address
from app.schemas import UserSchema, UserUpdateSchema, AddressSchema, AddressCreateSchema
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserSchema)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/profile", response_model=UserSchema)
async def update_profile(
    data: UserUpdateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.first_name is not None:
        current_user.first_name = data.first_name
    if data.last_name is not None:
        current_user.last_name = data.last_name
    if data.phone is not None:
        current_user.phone = data.phone
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/addresses", response_model=List[AddressSchema])
async def list_addresses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Address).where(Address.user_id == current_user.id).order_by(Address.is_default.desc())
    )
    return result.scalars().all()


@router.post("/addresses", response_model=AddressSchema)
async def add_address(
    data: AddressCreateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.is_default:
        # Unset previous default
        await db.execute(
            select(Address).where(Address.user_id == current_user.id, Address.is_default == True)
        )
        prev_default = await db.execute(
            select(Address).where(Address.user_id == current_user.id, Address.is_default == True)
        )
        for addr in prev_default.scalars().all():
            addr.is_default = False

    address = Address(user_id=current_user.id, **data.model_dump())
    db.add(address)
    await db.commit()
    await db.refresh(address)
    return address


@router.patch("/addresses/{id}", response_model=AddressSchema)
async def update_address(
    id: str,
    data: AddressCreateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Address).where(Address.id == id, Address.user_id == current_user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    if data.is_default and not address.is_default:
        prev = await db.execute(
            select(Address).where(Address.user_id == current_user.id, Address.is_default == True)
        )
        for addr in prev.scalars().all():
            addr.is_default = False

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(address, field, value)

    await db.commit()
    await db.refresh(address)
    return address


@router.delete("/addresses/{id}")
async def delete_address(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Address).where(Address.id == id, Address.user_id == current_user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    await db.delete(address)
    await db.commit()
    return {"message": "Address deleted"}


@router.patch("/addresses/{id}/default")
async def set_default_address(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Address).where(Address.id == id, Address.user_id == current_user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    prev = await db.execute(
        select(Address).where(Address.user_id == current_user.id, Address.is_default == True)
    )
    for addr in prev.scalars().all():
        addr.is_default = False

    address.is_default = True
    await db.commit()
    return {"message": "Default address updated"}
