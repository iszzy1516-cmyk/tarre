from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel

from app.models.order import OrderStatus, PaymentStatus


class OrderItemSchema(BaseModel):
    id: str
    product_name: str
    product_image: str | None
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    class Config:
        from_attributes = True


class OrderSchema(BaseModel):
    id: str
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    subtotal: Decimal
    shipping_cost: Decimal
    discount_amount: Decimal
    tax_amount: Decimal
    total: Decimal
    shipping_address: dict | None
    tracking_number: str | None
    items: list[OrderItemSchema]
    created_at: datetime

    class Config:
        from_attributes = True


class OrderCreateSchema(BaseModel):
    shipping_address: dict
    payment_method: str
    notes: str | None = None


class OrderUpdateSchema(BaseModel):
    status: OrderStatus | None = None
    payment_status: PaymentStatus | None = None
    tracking_number: str | None = None
    admin_notes: str | None = None
