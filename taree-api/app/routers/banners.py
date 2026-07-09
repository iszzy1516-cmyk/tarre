from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Banner, BannerPosition
from app.schemas import BannerSchema, BannerCreateSchema
from app.dependencies import get_admin_user

router = APIRouter(prefix="/banners", tags=["Banners"])


@router.get("", response_model=List[BannerSchema])
async def list_banners(
    position: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Banner).where(Banner.is_active == True).order_by(Banner.sort_order)
    if position:
        query = query.where(Banner.position == position)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/hero", response_model=List[BannerSchema])
async def hero_banners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Banner)
        .where(Banner.is_active == True, Banner.position == BannerPosition.HERO)
        .order_by(Banner.sort_order)
    )
    return result.scalars().all()


@router.post("", response_model=BannerSchema, status_code=201)
async def create_banner(
    data: BannerCreateSchema,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    banner = Banner(**data.model_dump())
    db.add(banner)
    await db.commit()
    await db.refresh(banner)
    return banner


@router.patch("/{id}", response_model=BannerSchema)
async def update_banner(
    id: str,
    data: BannerCreateSchema,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Banner).where(Banner.id == id))
    banner = result.scalar_one_or_none()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(banner, field, value)

    await db.commit()
    await db.refresh(banner)
    return banner


@router.delete("/{id}")
async def delete_banner(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Banner).where(Banner.id == id))
    banner = result.scalar_one_or_none()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")

    await db.delete(banner)
    await db.commit()
    return {"message": "Banner deleted"}
