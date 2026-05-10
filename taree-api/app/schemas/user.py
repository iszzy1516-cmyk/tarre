from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class AddressSchema(BaseModel):
    id: str
    label: str
    street: str
    city: str
    state: str
    zip_code: str | None
    country: str = "Nigeria"
    is_default: bool = False

    class Config:
        from_attributes = True


class AddressCreateSchema(BaseModel):
    label: str
    street: str
    city: str
    state: str
    zip_code: str | None = None
    country: str = "Nigeria"
    is_default: bool = False


class UserSchema(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    role: str
    email_verified: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    phone: str | None = None


class UserUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
