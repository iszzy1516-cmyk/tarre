from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Category, Product
from app.schemas import CategorySchema

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategorySchema])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category)
        .where(Category.is_active == True, Category.parent_id == None)
        .options(selectinload(Category.children))
        .order_by(Category.sort_order)
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=CategorySchema)
async def get_category(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category)
        .where(Category.slug == slug)
        .options(selectinload(Category.children))
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/{slug}/products")
async def category_products(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category).where(Category.slug == slug)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    products_result = await db.execute(
        select(Product)
        .where(Product.category_id == category.id, Product.is_active == True)
        .options(selectinload(Product.images))
    )
    return products_result.scalars().all()
