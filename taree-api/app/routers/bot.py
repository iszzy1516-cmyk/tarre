import os
import uuid
import io
import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from PIL import Image

from app.database import get_db
from app.models import Product, ProductImage, Order, OrderItem, Category
from app.schemas import ProductSchema, ProductCreateSchema, OrderSchema
from app.services.cloudinary import cloudinary_service
from app.config import settings
from app.dependencies import get_admin_user

router = APIRouter(prefix="/bot", tags=["Bot"])


def _verify_bot_key(x_bot_api_key: str = Header(...)):
    if x_bot_api_key != settings.bot_api_key:
        raise HTTPException(status_code=403, detail="Invalid bot API key")
    return True


@router.get("/categories")
async def bot_categories(
    db: AsyncSession = Depends(get_db),
    _=Depends(_verify_bot_key),
):
    result = await db.execute(select(Category).order_by(Category.name))
    return [{"id": c.id, "name": c.name, "slug": c.slug} for c in result.scalars().all()]


@router.post("/products", response_model=ProductSchema, status_code=201)
async def bot_create_product(
    data: ProductCreateSchema,
    db: AsyncSession = Depends(get_db),
    _=Depends(_verify_bot_key),
):
    existing = await db.execute(select(Product).where((Product.slug == data.slug) | (Product.sku == data.sku)))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Product slug or SKU already exists")

    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)

    result = await db.execute(
        select(Product).where(Product.id == product.id).options(
            selectinload(Product.images),
            selectinload(Product.variants),
            selectinload(Product.category),
        )
    )
    return result.scalar_one()


from pydantic import BaseModel

class ProductImagePayload(BaseModel):
    url: str
    is_primary: bool = True

@router.post("/products/{product_id}/images")
async def bot_add_product_image(
    product_id: str,
    payload: ProductImagePayload,
    db: AsyncSession = Depends(get_db),
    _=Depends(_verify_bot_key),
):
    image = ProductImage(product_id=product_id, url=payload.url, is_primary=payload.is_primary)
    db.add(image)
    await db.commit()
    await db.refresh(image)
    return {"id": image.id, "url": image.url, "is_primary": image.is_primary}


def _compress_image(file_bytes: bytes, max_size: int = 1200, quality: int = 85) -> bytes:
    """Compress and resize image for web. Returns JPEG bytes."""
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img = img.convert("RGB")

        # Resize if larger than max_size on any edge
        if max(img.size) > max_size:
            ratio = max_size / max(img.size)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality, optimize=True)
        return buf.getvalue()
    except Exception:
        # If compression fails (e.g. not an image), return original
        return file_bytes


@router.post("/upload-image")
async def bot_upload_image(
    file: UploadFile = File(...),
    _=Depends(_verify_bot_key),
):
    contents = await file.read()

    # Compress before uploading (handles large PNGs from customers)
    compressed = _compress_image(contents)

    result = await cloudinary_service.upload_image(compressed, "taree_products")

    if result.get("url"):
        return {"url": result["url"], "public_id": result.get("public_id", "")}

    # Fallback: save locally when Cloudinary is not configured
    filename = f"{uuid.uuid4().hex}.jpg"
    upload_dir = os.path.join(os.path.dirname(__file__), "..", "..", "static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as f:
        f.write(compressed)

    local_url = f"http://127.0.0.1:8000/static/uploads/{filename}"
    return {"url": local_url, "public_id": ""}


@router.get("/orders")
async def bot_orders(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    _=Depends(_verify_bot_key),
):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .order_by(desc(Order.created_at))
        .limit(limit)
    )
    orders = result.scalars().all()
    return [
        {
            "id": o.id,
            "order_number": o.order_number,
            "status": o.status.value if hasattr(o.status, "value") else str(o.status),
            "payment_status": o.payment_status.value if hasattr(o.payment_status, "value") else str(o.payment_status),
            "total": float(o.total),
            "shipping_address": o.shipping_address,
            "items": [
                {
                    "product_name": i.product_name,
                    "quantity": i.quantity,
                    "total_price": float(i.total_price),
                }
                for i in o.items
            ],
            "created_at": o.created_at.isoformat() if o.created_at else None,
        }
        for o in orders
    ]
