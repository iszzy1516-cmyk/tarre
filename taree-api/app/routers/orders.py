from typing import List
from decimal import Decimal
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.models import Order, OrderItem, OrderStatus, Product, ProductVariant, ProductImage
from app.schemas import OrderSchema, OrderCreateSchema
from app.dependencies import get_current_user, get_current_user_optional
from app.services.email_service import email_service
from app.services.whatsapp import whatsapp_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderSchema)
async def create_order(
    data: OrderCreateSchema,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    # Calculate totals from cart items
    subtotal = Decimal("0.00")
    order_items = []

    for item_data in data.items:
        product_result = await db.execute(
            select(Product).where(Product.id == item_data.product_id)
        )
        product = product_result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_data.product_id} not found")
        if product.stock_quantity < item_data.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}. Available: {product.stock_quantity}"
            )

        unit_price = product.price
        if item_data.variant_id:
            variant_result = await db.execute(
                select(ProductVariant).where(
                    ProductVariant.id == item_data.variant_id,
                    ProductVariant.product_id == product.id
                )
            )
            variant = variant_result.scalar_one_or_none()
            if variant:
                unit_price = product.price + (variant.price_adjustment or Decimal("0.00"))

        total_price = unit_price * item_data.quantity
        subtotal += total_price

        # Fetch primary image separately to avoid lazy loading issues
        image_result = await db.execute(
            select(ProductImage)
            .where(ProductImage.product_id == product.id)
            .order_by(ProductImage.sort_order)
        )
        images = image_result.scalars().all()
        primary_image = images[0].url if images else None

        order_items.append({
            "product_id": product.id,
            "variant_id": item_data.variant_id,
            "product_name": product.name,
            "product_image": primary_image,
            "quantity": item_data.quantity,
            "unit_price": unit_price,
            "total_price": total_price,
        })

    shipping_cost = Decimal("0.00")
    total = subtotal + shipping_cost

    order = Order(
        order_number=f"TAREE-{datetime.now().strftime('%Y%m%d')}-{await _get_next_order_number(db)}",
        user_id=current_user.id if current_user else None,
        guest_email=data.shipping_address.get("email") if not current_user else None,
        guest_phone=data.shipping_address.get("phone") if not current_user else None,
        status=OrderStatus.PENDING,
        payment_status="pending",
        payment_method=data.payment_method,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total=total,
        shipping_address=data.shipping_address,
        notes=data.notes,
    )
    db.add(order)
    await db.flush()  # Get order.id

    for oi in order_items:
        db.add(OrderItem(order_id=order.id, **oi))

    # Deduct stock
    for item_data in data.items:
        product_result = await db.execute(
            select(Product).where(Product.id == item_data.product_id)
        )
        product = product_result.scalar_one()
        product.stock_quantity -= item_data.quantity

    await db.commit()

    # Fetch order with items for response using joinedload
    result = await db.execute(
        select(Order)
        .where(Order.id == order.id)
        .options(joinedload(Order.items))
    )
    order_with_items = result.unique().scalar_one()

    # Send order confirmation email
    email = data.shipping_address.get("email") if not current_user else current_user.email
    if email:
        await email_service.send_order_confirmation(email, order.order_number, float(order.total))

    # Send WhatsApp notification if phone available
    phone = data.shipping_address.get("phone") if not current_user else current_user.phone
    if phone:
        await whatsapp_service.send_order_notification(phone, order.order_number, float(order.total))

    return order_with_items


@router.get("", response_model=List[OrderSchema])
async def list_orders(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(joinedload(Order.items))
        .order_by(Order.created_at.desc())
    )
    return result.unique().scalars().all()


@router.get("/{id}", response_model=OrderSchema)
async def get_order(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(Order)
        .where(Order.id == id, Order.user_id == current_user.id)
        .options(joinedload(Order.items))
    )
    order = result.unique().scalar_one_or_none()
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


async def _get_next_order_number(db: AsyncSession) -> str:
    """Generate sequential order number: TAREE-YYYY-NNNNN"""
    year = datetime.now().year
    prefix = f"TAREE-{year}-"
    result = await db.execute(
        select(Order.order_number)
        .where(Order.order_number.like(f"{prefix}%"))
        .order_by(Order.order_number.desc())
        .limit(1)
    )
    latest = result.scalar_one_or_none()
    if latest:
        try:
            seq = int(latest.split("-")[-1])
            return f"{prefix}{seq + 1:05d}"
        except (ValueError, IndexError):
            pass
    return f"{prefix}00001"
