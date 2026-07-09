from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, field_serializer

from app.models.order import OrderStatus, PaymentStatus


class UserBriefSchema(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str

    class Config:
        from_attributes = True


class OrderItemCreateSchema(BaseModel):
    product_id: str
    variant_id: str | None = None
    quantity: int


class OrderItemSchema(BaseModel):
    id: str
    product_name: str
    product_image: str | None
    quantity: int
    unit_price: float
    total_price: float

    @field_serializer("unit_price", "total_price")
    def serialize_decimal(self, value: Decimal) -> float:
        return float(value)

    class Config:
        from_attributes = True


class OrderSchema(BaseModel):
    id: str
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    subtotal: float
    shipping_cost: float
    discount_amount: float
    tax_amount: float
    total: float
    shipping_address: dict | None
    tracking_number: str | None
    items: list[OrderItemSchema]
    user: UserBriefSchema | None
    created_at: datetime

    @field_serializer("subtotal", "shipping_cost", "discount_amount", "tax_amount", "total")
    def serialize_decimal(self, value: Decimal) -> float:
        return float(value)

    class Config:
        from_attributes = True


class OrderCreateSchema(BaseModel):
    items: list[OrderItemCreateSchema]
    shipping_address: dict
    payment_method: str
    notes: str | None = None


class OrderUpdateSchema(BaseModel):
    status: OrderStatus | None = None
    payment_status: PaymentStatus | None = None
    tracking_number: str | None = None
    admin_notes: str | None = None
