import uuid
from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional

from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BannerPosition(str, PyEnum):
    HERO = "hero"
    PROMO = "promo"
    CATEGORY = "category"


class Banner(Base):
    __tablename__ = "banners"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(200))
    subtitle: Mapped[Optional[str]] = mapped_column(String(500))
    image: Mapped[str] = mapped_column(String(500))
    mobile_image: Mapped[Optional[str]] = mapped_column(String(500))
    cta_text: Mapped[Optional[str]] = mapped_column(String(100))
    cta_link: Mapped[Optional[str]] = mapped_column(String(500))
    position: Mapped[BannerPosition] = mapped_column(default=BannerPosition.HERO)
    is_active: Mapped[bool] = mapped_column(default=True)
    sort_order: Mapped[int] = mapped_column(default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
