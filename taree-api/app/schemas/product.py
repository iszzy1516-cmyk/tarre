from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, field_serializer


class ProductImageSchema(BaseModel):
    id: str
    url: str
    public_id: str | None
    alt_text: str | None
    sort_order: int
    is_primary: bool

    class Config:
        from_attributes = True


class ProductVariantSchema(BaseModel):
    id: str
    name: str
    price_adjustment: float | None
    stock_quantity: int
    sku: str

    @field_serializer("price_adjustment")
    def serialize_price_adjustment(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None

    class Config:
        from_attributes = True


class CategoryBriefSchema(BaseModel):
    id: str
    name: str
    slug: str

    class Config:
        from_attributes = True


class ProductSchema(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    short_description: str | None
    price: float
    compare_at_price: float | None
    cost_price: float | None
    sku: str
    stock_quantity: int
    material: str | None
    is_active: bool
    is_featured: bool
    is_new_arrival: bool
    category: CategoryBriefSchema
    images: list[ProductImageSchema]
    variants: list[ProductVariantSchema]
    created_at: datetime

    @field_serializer("price", "compare_at_price", "cost_price")
    def serialize_decimal(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None

    class Config:
        from_attributes = True


class ProductListSchema(BaseModel):
    id: str
    name: str
    slug: str
    price: float
    compare_at_price: float | None
    sku: str
    stock_quantity: int
    is_new_arrival: bool
    is_featured: bool
    images: list[ProductImageSchema]
    category: CategoryBriefSchema

    @field_serializer("price", "compare_at_price")
    def serialize_decimal(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None

    class Config:
        from_attributes = True


class ProductCreateSchema(BaseModel):
    name: str
    slug: str
    description: str
    short_description: str | None = None
    price: Decimal
    compare_at_price: Decimal | None = None
    cost_price: Decimal | None = None
    sku: str
    stock_quantity: int = 0
    weight_grams: float | None = None
    material: str | None = None
    category_id: str
    is_featured: bool = False
    is_new_arrival: bool = False
    meta_title: str | None = None
    meta_description: str | None = None


class ProductUpdateSchema(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    short_description: str | None = None
    price: Decimal | None = None
    compare_at_price: Decimal | None = None
    cost_price: Decimal | None = None
    stock_quantity: int | None = None
    weight_grams: float | None = None
    material: str | None = None
    category_id: str | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    is_new_arrival: bool | None = None
    meta_title: str | None = None
    meta_description: str | None = None
