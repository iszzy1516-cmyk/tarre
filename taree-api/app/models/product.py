import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, Numeric, Integer, Table, Column, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

ProductTag = Table(
    "product_tags",
    Base.metadata,
    Column("product_id", String(36), ForeignKey("products.id"), primary_key=True),
    Column("tag_id", String(36), ForeignKey("tags.id"), primary_key=True),
)


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    short_description: Mapped[Optional[str]] = mapped_column(String(500))
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    compare_at_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2))
    cost_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2))
    sku: Mapped[str] = mapped_column(String(100), unique=True)
    stock_quantity: Mapped[int] = mapped_column(default=0)
    weight_grams: Mapped[Optional[float]] = mapped_column()
    material: Mapped[Optional[str]] = mapped_column(String(100))
    is_active: Mapped[bool] = mapped_column(default=True)
    is_featured: Mapped[bool] = mapped_column(default=False)
    is_new_arrival: Mapped[bool] = mapped_column(default=False)
    category_id: Mapped[str] = mapped_column(ForeignKey("categories.id"))

    meta_title: Mapped[Optional[str]] = mapped_column(String(200))
    meta_description: Mapped[Optional[str]] = mapped_column(String(500))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category: Mapped["Category"] = relationship(back_populates="products")
    images: Mapped[List["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    variants: Mapped[List["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    tags: Mapped[List["Tag"]] = relationship(secondary=ProductTag, back_populates="products")
    reviews: Mapped[List["Review"]] = relationship(back_populates="product")
    order_items: Mapped[List["OrderItem"]] = relationship(back_populates="product")
    wishlist_items: Mapped[List["WishlistItem"]] = relationship(back_populates="product")


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    url: Mapped[str] = mapped_column(String(500))
    alt_text: Mapped[Optional[str]] = mapped_column(String(200))
    sort_order: Mapped[int] = mapped_column(default=0)
    is_primary: Mapped[bool] = mapped_column(default=False)

    product: Mapped["Product"] = relationship(back_populates="images")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    name: Mapped[str] = mapped_column(String(100))
    price_adjustment: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2))
    stock_quantity: Mapped[int] = mapped_column(default=0)
    sku: Mapped[str] = mapped_column(String(100), unique=True)

    product: Mapped["Product"] = relationship(back_populates="variants")


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(50), unique=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True)

    products: Mapped[List["Product"]] = relationship(secondary=ProductTag, back_populates="tags")
