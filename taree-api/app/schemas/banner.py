from datetime import datetime
from pydantic import BaseModel

from app.models.banner import BannerPosition


class BannerSchema(BaseModel):
    id: str
    title: str
    subtitle: str | None
    image: str
    mobile_image: str | None
    cta_text: str | None
    cta_link: str | None
    position: BannerPosition
    is_active: bool
    sort_order: int
    created_at: datetime

    class Config:
        from_attributes = True


class BannerCreateSchema(BaseModel):
    title: str
    subtitle: str | None = None
    image: str
    mobile_image: str | None = None
    cta_text: str | None = None
    cta_link: str | None = None
    position: BannerPosition = BannerPosition.HERO
    is_active: bool = True
    sort_order: int = 0
