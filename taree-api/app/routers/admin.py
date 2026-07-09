from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order, Product, ProductImage, Review, User, OrderStatus, PaymentStatus
from app.schemas import OrderUpdateSchema
from app.schemas import OrderSchema, ProductSchema, ProductCreateSchema, ProductUpdateSchema, ReviewSchema, ProductImageSchema
from app.dependencies import get_admin_user
from app.services.cloudinary import cloudinary_service
from app.services.meilisearch import meilisearch_service
from app.utils.validators import sanitize_html
import re

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    total_revenue = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0)).where(Order.payment_status == PaymentStatus.PAID)
    )
    total_orders = await db.execute(select(func.count(Order.id)))
    pending_orders = await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.PENDING)
    )
    total_customers = await db.execute(select(func.count(User.id)).where(User.role == "customer"))
    low_stock = await db.execute(
        select(func.count(Product.id)).where(Product.stock_quantity <= 5, Product.is_active == True)
    )
    shipped_orders = await db.execute(
        select(func.count(Order.id)).where(Order.status == OrderStatus.SHIPPED)
    )

    # Revenue breakdown
    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

    revenue_today = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(Order.payment_status == PaymentStatus.PAID, Order.created_at >= today_start)
    )
    revenue_month = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(Order.payment_status == PaymentStatus.PAID, Order.created_at >= month_start)
    )
    revenue_year = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(Order.payment_status == PaymentStatus.PAID, Order.created_at >= year_start)
    )

    return {
        "total_revenue": float(total_revenue.scalar()),
        "revenue_today": float(revenue_today.scalar()),
        "revenue_month": float(revenue_month.scalar()),
        "revenue_year": float(revenue_year.scalar()),
        "total_orders": total_orders.scalar(),
        "pending_orders": pending_orders.scalar(),
        "shipped_orders": shipped_orders.scalar(),
        "total_customers": total_customers.scalar(),
        "low_stock": low_stock.scalar(),
    }


@router.get("/orders", response_model=List[OrderSchema])
async def admin_orders(
    status: str | None = None,
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    query = select(Order).options(selectinload(Order.items), selectinload(Order.user)).order_by(desc(Order.created_at))
    if status:
        query = query.where(Order.status == status)

    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    return result.scalars().all()


@router.patch("/orders/{id}/status")
async def update_order_status(
    id: str,
    data: OrderUpdateSchema,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Order).where(Order.id == id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if data.status is not None:
        order.status = data.status
    if data.payment_status is not None:
        order.payment_status = data.payment_status
    if data.tracking_number is not None:
        order.tracking_number = data.tracking_number
    if data.admin_notes is not None:
        order.admin_notes = data.admin_notes
    await db.commit()
    return {"message": "Order updated"}


@router.get("/products", response_model=List[ProductSchema])
async def admin_products(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(
        select(Product).options(
            selectinload(Product.images),
            selectinload(Product.variants),
            selectinload(Product.category),
        )
    )
    return result.scalars().all()


@router.get("/reviews", response_model=List[ReviewSchema])
async def admin_reviews(
    approved: bool | None = None,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    query = select(Review).options(selectinload(Review.user))
    if approved is not None:
        query = query.where(Review.is_approved == approved)
    result = await db.execute(query.order_by(desc(Review.created_at)))
    return result.scalars().all()


@router.patch("/reviews/{id}/approve")
async def approve_review(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Review).where(Review.id == id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_approved = True
    await db.commit()
    return {"message": "Review approved"}


@router.post("/products", response_model=ProductSchema, status_code=201)
async def create_product(
    data: ProductCreateSchema,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    # Check for duplicate slug or sku
    existing = await db.execute(select(Product).where(
        (Product.slug == data.slug) | (Product.sku == data.sku)
    ))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Product slug or SKU already exists")

    payload = data.model_dump()
    payload["description"] = sanitize_html(payload.get("description"))
    payload["short_description"] = sanitize_html(payload.get("short_description"))
    product = Product(**payload)
    db.add(product)
    await db.commit()
    await db.refresh(product)

    # Index in Meilisearch
    await _index_product(db, product.id)

    # Eager load relationships for response
    result = await db.execute(
        select(Product).where(Product.id == product.id).options(
            selectinload(Product.images),
            selectinload(Product.variants),
            selectinload(Product.category),
        )
    )
    return result.scalar_one()


@router.patch("/products/{id}", response_model=ProductSchema)
async def update_product(
    id: str,
    data: ProductUpdateSchema,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = data.model_dump(exclude_unset=True)
    if "description" in update_data:
        update_data["description"] = sanitize_html(update_data["description"])
    if "short_description" in update_data:
        update_data["short_description"] = sanitize_html(update_data["short_description"])
    for field, value in update_data.items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)

    # Re-index in Meilisearch
    await _index_product(db, product.id)

    result = await db.execute(
        select(Product).where(Product.id == product.id).options(
            selectinload(Product.images),
            selectinload(Product.variants),
            selectinload(Product.category),
        )
    )
    return result.scalar_one()


async def _index_product(db: AsyncSession, product_id: str):
    result = await db.execute(
        select(Product).where(Product.id == product_id).options(selectinload(Product.category))
    )
    product = result.scalar_one_or_none()
    if product:
        await meilisearch_service.index_products([{
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "description": product.description,
            "short_description": product.short_description or "",
            "price": float(product.price),
            "material": product.material or "",
            "category": product.category.name if product.category else "",
            "is_featured": product.is_featured,
            "is_new_arrival": product.is_new_arrival,
        }])


@router.post("/index-products")
async def reindex_products(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.is_active == True)
    )
    products = result.scalars().all()
    docs = [{
        "id": p.id,
        "name": p.name,
        "slug": p.slug,
        "description": p.description,
        "short_description": p.short_description or "",
        "price": float(p.price),
        "material": p.material or "",
        "category": p.category.name if p.category else "",
        "is_featured": p.is_featured,
        "is_new_arrival": p.is_new_arrival,
    } for p in products]
    await meilisearch_service.index_products(docs)
    return {"message": f"Indexed {len(docs)} products"}


@router.get("/customers")
async def admin_customers(
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    query = select(User).where(User.role == "customer").order_by(desc(User.created_at))
    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    return result.scalars().all()


@router.delete("/products/{id}")
async def delete_product(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Load images for Cloudinary cleanup
    result = await db.execute(
        select(Product).where(Product.id == id).options(selectinload(Product.images))
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Delete images from Cloudinary
    for img in product.images:
        public_id = img.public_id
        if not public_id and img.url:
            # Extract public_id from Cloudinary URL
            m = re.search(r"/upload/(?:v\d+/)?(.+)\.\w+$", img.url)
            if m:
                public_id = m.group(1)
        if public_id:
            await cloudinary_service.delete_image(public_id)

    await db.delete(product)
    await db.commit()
    return {"message": "Product deleted"}


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


def _validate_image(file: UploadFile) -> bytes:
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: jpg, png, webp. Got: {file.content_type}",
        )
    MAX_SIZE = 5 * 1024 * 1024  # 5MB
    contents = file.file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max 5MB.")
    return contents


@router.post("/products/{id}/images", response_model=ProductImageSchema)
async def add_product_image(
    id: str,
    file: UploadFile = File(...),
    alt_text: str = "",
    is_primary: bool = False,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user),
):
    contents = _validate_image(file)

    product_result = await db.execute(select(Product).where(Product.id == id))
    product = product_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    result = await cloudinary_service.upload_image(contents, "taree_products")
    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])

    image = ProductImage(
        product_id=id,
        url=result["url"],
        public_id=result.get("public_id"),
        alt_text=alt_text,
        is_primary=is_primary,
    )
    db.add(image)
    await db.commit()
    await db.refresh(image)
    return image


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = "taree_products",
    admin=Depends(get_admin_user),
):
    contents = _validate_image(file)
    result = await cloudinary_service.upload_image(contents, folder)
    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])
    return {"url": result["url"], "public_id": result["public_id"]}
