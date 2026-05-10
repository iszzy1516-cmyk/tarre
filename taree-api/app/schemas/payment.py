from pydantic import BaseModel


class PaymentInitializeSchema(BaseModel):
    order_id: str
    email: str | None = None
    phone: str | None = None


class PaymentVerifySchema(BaseModel):
    reference: str
