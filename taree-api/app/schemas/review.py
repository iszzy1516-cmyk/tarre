from datetime import datetime
from pydantic import BaseModel, Field


class ReviewUserSchema(BaseModel):
    id: str
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


class ReviewSchema(BaseModel):
    id: str
    user: ReviewUserSchema
    rating: int = Field(..., ge=1, le=5)
    title: str | None
    comment: str | None
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewCreateSchema(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: str | None = None
    comment: str | None = None
