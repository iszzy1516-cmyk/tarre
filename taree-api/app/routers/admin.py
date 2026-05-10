from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order, Product, Review, User, OrderStatus, PaymentStatus
from app.schemas import OrderUpdateSchema
from app.schemas import OrderSchema, ProductSchema, ReviewSchema
from app.dependencies import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    total_revenue = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0)).where(Order.payment_status == PaymentStatus.PAID)
    )
    total_orders = await db.execute(select(func.count(Order.id)))
    pending_orders = await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.PENDING)
    )
    total_customers = await db.execute(select(func.count(User.id)).where(User.role == "customer"))

    return {
        "total_revenue": float(total_revenue.scalar()),
        "total_orders": total_orders.scalar(),
        "pending_orders": pending_orders.scalar(),
        "total_customers": total_customers.scalar(),
    }


@router.get("/orders", response_model=List[OrderSchema])
async def admin_orders(
    status: str | None = None,
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    query = select(Order).options(selectinload(Order.items)).order_by(desc(Order.created_at))
    if status:
        query = query.where(Order.status == status)

    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    return result.scalars().all()


@router.patch("/orders/{id}/status")
async def update_order_status(
    id: str,
    data: OrderUpdateSchema,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Order).where(Order.id == id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if data.status is not None:
        order.status = data.status
    if data.payment_status is not None:
        order.payment_status = data.payment_status
    if data.tracking_number is not None:
        order.tracking_number = data.tracking_number
    if data.admin_notes is not None:
        order.admin_notes = data.admin_notes
    await db.commit()
    return {"message": "Order updated"}


@router.get("/products", response_model=List[ProductSchema])
async def admin_products(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(
        select(Product).options(
            selectinload(Product.images),
            selectinload(Product.variants),
            selectinload(Product.category),
        )
    )
    return result.scalars().all()


@router.get("/reviews", response_model=List[ReviewSchema])
async def admin_reviews(
    approved: bool | None = None,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    query = select(Review).options(selectinload(Review.user))
    if approved is not None:
        query = query.where(Review.is_approved == approved)
    result = await db.execute(query.order_by(desc(Review.created_at)))
    return result.scalars().all()


@router.patch("/reviews/{id}/approve")
async def approve_review(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Review).where(Review.id == id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = True
    await db.commit()
    return {"message": "Review approved"}
