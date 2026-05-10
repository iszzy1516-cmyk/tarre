from typing import List
from decimal import Decimal
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order, OrderItem, OrderStatus, Product
from app.schemas import OrderSchema, OrderCreateSchema
from app.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderSchema)
async def create_order(
    data: OrderCreateSchema,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    # This is a simplified order creation
    # In production, you'd calculate from cart items
    order = Order(
        order_number=f"TAREE-{datetime.now().strftime('%Y%m%d')}-{await _get_next_order_number(db)}",
        user_id=current_user.id if current_user else None,
        guest_email=data.shipping_address.get("email") if not current_user else None,
        guest_phone=data.shipping_address.get("phone") if not current_user else None,
        status=OrderStatus.PENDING,
        payment_status="pending",
        payment_method=data.payment_method,
        subtotal=Decimal("0.00"),
        shipping_cost=Decimal("0.00"),
        total=Decimal("0.00"),
        shipping_address=data.shipping_address,
        notes=data.notes,
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order


@router.get("", response_model=List[OrderSchema])
async def list_orders(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{id}", response_model=OrderSchema)
async def get_order(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(Order)
        .where(Order.id == id, Order.user_id == current_user.id)
        .options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{id}/cancel")
async def cancel_order(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(Order).where(Order.id == id, Order.user_id == current_user.id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending orders can be cancelled")

    order.status = OrderStatus.CANCELLED
    await db.commit()
    return {"message": "Order cancelled"}


import random


async def _get_next_order_number(db: AsyncSession) -> str:
    return str(random.randint(1000, 9999))
