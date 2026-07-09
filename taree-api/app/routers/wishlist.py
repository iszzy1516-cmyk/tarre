from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import WishlistItem, Product, ProductImage
from app.dependencies import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("")
async def list_wishlist(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(WishlistItem)
        .where(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.created_at.desc())
    )
    wishlist_items = result.scalars().all()

    items = []
    for wishlist_item in wishlist_items:
        # Fetch product separately with eager loading avoided
        product_result = await db.execute(
            select(Product).where(Product.id == wishlist_item.product_id)
        )
        product = product_result.scalar_one_or_none()
        if not product:
            continue

        # Fetch images separately
        image_result = await db.execute(
            select(ProductImage)
            .where(ProductImage.product_id == product.id)
            .order_by(ProductImage.sort_order)
        )
        images = image_result.scalars().all()

        items.append({
            "id": wishlist_item.id,
            "product": {
                "id": product.id,
                "name": product.name,
                "slug": product.slug,
                "price": float(product.price),
                "images": [{"url": img.url, "alt": img.alt_text} for img in images],
                "category": {"name": product.category.name, "slug": product.category.slug},
                "stockQuantity": product.stock_quantity,
            },
            "created_at": wishlist_item.created_at,
        })
    return items


@router.post("")
async def add_to_wishlist(
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    product_id = data.get("product_id")
    if not product_id:
        raise HTTPException(status_code=400, detail="product_id required")

    # Check if already in wishlist
    result = await db.execute(
        select(WishlistItem).where(
            and_(
                WishlistItem.user_id == current_user.id,
                WishlistItem.product_id == product_id,
            )
        )
    )
    if result.scalar_one_or_none():
        return {"message": "Already in wishlist"}

    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    await db.commit()
    return {"message": "Added to wishlist"}


@router.delete("/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(WishlistItem).where(
            and_(
                WishlistItem.user_id == current_user.id,
                WishlistItem.product_id == product_id,
            )
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in wishlist")

    await db.delete(item)
    await db.commit()
    return {"message": "Removed from wishlist"}
