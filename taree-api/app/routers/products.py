from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Product, Category
from app.schemas import ProductSchema, ProductListSchema

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[ProductListSchema])
async def list_products(
    db: AsyncSession = Depends(get_db),
    category: str | None = Query(None),
    min_price: float | None = Query(None),
    max_price: float | None = Query(None),
    material: str | None = Query(None),
    is_new_arrival: bool | None = Query(None),
    is_featured: bool | None = Query(None),
    sort: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    query = select(Product).where(Product.is_active == True).options(
        selectinload(Product.images),
        selectinload(Product.category),
    )

    if category:
        query = query.join(Category).where(Category.slug == category)
    if min_price is not None:
        query = query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)
    if material:
        query = query.where(Product.material.ilike(f"%{material}%"))
    if is_new_arrival is not None:
        query = query.where(Product.is_new_arrival == is_new_arrival)
    if is_featured is not None:
        query = query.where(Product.is_featured == is_featured)

    sort_map = {
        "price_asc": Product.price.asc(),
        "price_desc": Product.price.desc(),
        "newest": Product.created_at.desc(),
    }
    query = query.order_by(sort_map.get(sort, Product.created_at.desc()))

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar()

    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()

    return products


@router.get("/featured", response_model=List[ProductListSchema])
async def featured_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .where(Product.is_active == True, Product.is_featured == True)
        .options(selectinload(Product.images), selectinload(Product.category))
        .limit(8)
    )
    return result.scalars().all()


@router.get("/new-arrivals", response_model=List[ProductListSchema])
async def new_arrivals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .where(Product.is_active == True, Product.is_new_arrival == True)
        .options(selectinload(Product.images), selectinload(Product.category))
        .limit(8)
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=ProductSchema)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .where(Product.slug == slug, Product.is_active == True)
        .options(
            selectinload(Product.images),
            selectinload(Product.variants),
            selectinload(Product.category),
        )
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
