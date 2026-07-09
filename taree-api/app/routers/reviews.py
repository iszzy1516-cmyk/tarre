from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Review, Product
from app.schemas import ReviewSchema, ReviewCreateSchema
from app.dependencies import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/products/{product_id}", response_model=List[ReviewSchema])
async def list_reviews(
    product_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Review)
        .where(Review.product_id == product_id, Review.is_approved == True)
        .order_by(desc(Review.created_at))
    )
    return result.scalars().all()


@router.post("/products/{product_id}", response_model=ReviewSchema, status_code=201)
async def create_review(
    product_id: str,
    data: ReviewCreateSchema,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    product_result = await db.execute(select(Product).where(Product.id == product_id))
    product = product_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    review = Review(
        user_id=current_user.id,
        product_id=product_id,
        rating=data.rating,
        title=data.title,
        comment=data.comment,
        is_approved=False,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review
