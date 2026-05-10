from pydantic import BaseModel


class CartItemSchema(BaseModel):
    id: str
    product_id: str
    variant_id: str | None
    quantity: int
    product_name: str
    product_image: str | None
    unit_price: float
    total_price: float


class CartAddSchema(BaseModel):
    product_id: str
    variant_id: str | None = None
    quantity: int = 1


class CartUpdateSchema(BaseModel):
    quantity: int
