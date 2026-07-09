from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CartItem, Product, ProductImage
from app.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/cart", tags=["Cart"])


def get_session_id(request: Request, response: Response) -> str:
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = str(uuid.uuid4())
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            samesite="lax",
            max_age=30 * 24 * 60 * 60,  # 30 days
            path="/",
        )
    return session_id


async def _get_product_image(db: AsyncSession, product_id: str) -> str | None:
    result = await db.execute(
        select(ProductImage)
        .where(ProductImage.product_id == product_id)
        .order_by(ProductImage.sort_order)
    )
    images = result.scalars().all()
    return images[0].url if images else None


@router.get("")
async def get_cart(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    if current_user:
        result = await db.execute(
            select(CartItem, Product)
            .join(Product, CartItem.product_id == Product.id)
            .where(CartItem.user_id == current_user.id)
        )
    else:
        session_id = get_session_id(request, response)
        result = await db.execute(
            select(CartItem, Product)
            .join(Product, CartItem.product_id == Product.id)
            .where(CartItem.session_id == session_id)
        )

    items = []
    for cart_item, product in result.all():
        primary_image = await _get_product_image(db, product.id)
        items.append({
            "id": cart_item.id,
            "product_id": product.id,
            "name": product.name,
            "slug": product.slug,
            "price": float(product.price),
            "image": primary_image,
            "quantity": cart_item.quantity,
            "variant_id": cart_item.variant_id,
        })
    return {"items": items}


@router.post("/items")
async def add_cart_item(
    data: dict,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    product_id = data.get("product_id")
    variant_id = data.get("variant_id")
    quantity = data.get("quantity", 1)

    product_result = await db.execute(select(Product).where(Product.id == product_id))
    product = product_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if current_user:
        result = await db.execute(
            select(CartItem).where(
                and_(
                    CartItem.user_id == current_user.id,
                    CartItem.product_id == product_id,
                    CartItem.variant_id == variant_id,
                )
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.quantity += quantity
        else:
            db.add(CartItem(user_id=current_user.id, product_id=product_id, variant_id=variant_id, quantity=quantity))
    else:
        session_id = get_session_id(request, response)
        result = await db.execute(
            select(CartItem).where(
                and_(
                    CartItem.session_id == session_id,
                    CartItem.product_id == product_id,
                    CartItem.variant_id == variant_id,
                )
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.quantity += quantity
        else:
            db.add(CartItem(session_id=session_id, product_id=product_id, variant_id=variant_id, quantity=quantity))

    await db.commit()
    return {"message": "Item added to cart"}


@router.patch("/items/{item_id}")
async def update_cart_item(
    item_id: str,
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    result = await db.execute(
        select(CartItem).where(
            CartItem.id == item_id,
            CartItem.user_id == (current_user.id if current_user else None),
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    quantity = data.get("quantity", 1)
    if quantity <= 0:
        await db.delete(item)
    else:
        item.quantity = quantity

    await db.commit()
    return {"message": "Cart updated"}


@router.delete("/items/{item_id}")
async def remove_cart_item(
    item_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    result = await db.execute(
        select(CartItem).where(
            CartItem.id == item_id,
            CartItem.user_id == (current_user.id if current_user else None),
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Item removed"}


@router.post("/merge")
async def merge_cart(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return {"message": "No guest cart to merge"}

    guest_items = await db.execute(
        select(CartItem).where(CartItem.session_id == session_id)
    )
    guest_items = guest_items.scalars().all()

    for guest_item in guest_items:
        result = await db.execute(
            select(CartItem).where(
                and_(
                    CartItem.user_id == current_user.id,
                    CartItem.product_id == guest_item.product_id,
                    CartItem.variant_id == guest_item.variant_id,
                )
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.quantity += guest_item.quantity
            await db.delete(guest_item)
        else:
            guest_item.user_id = current_user.id
            guest_item.session_id = None

    await db.commit()
    response.delete_cookie("session_id", path="/")
    return {"message": "Cart merged"}


@router.delete("")
async def clear_cart(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    if current_user:
        result = await db.execute(
            select(CartItem).where(CartItem.user_id == current_user.id)
        )
        for item in result.scalars().all():
            await db.delete(item)
    await db.commit()
    return {"message": "Cart cleared"}
