"""Seed script for TAREÉ Jewelry demo data."""
import asyncio
import uuid
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_maker, engine, Base
from app.models.category import Category
from app.models.product import Product, ProductImage, ProductVariant
from app.models.banner import Banner, BannerPosition
from app.utils.security import hash_password
from app.models.user import User


async def seed_categories(db: AsyncSession):
    categories = [
        Category(name="Necklaces", slug="necklaces", description="Elegant necklaces for every occasion", sort_order=1),
        Category(name="Earrings", slug="earrings", description="Stunning earrings from studs to chandeliers", sort_order=2),
        Category(name="Rings", slug="rings", description="Engagement, wedding, and fashion rings", sort_order=3),
        Category(name="Bracelets", slug="bracelets", description="Beautiful bracelets and bangles", sort_order=4),
        Category(name="Bridal Sets", slug="bridal-sets", description="Complete bridal jewelry collections", sort_order=5),
    ]
    for cat in categories:
        db.add(cat)
    await db.commit()
    return categories


async def seed_products(db: AsyncSession, categories: list[Category]):
    products_data = [
        {
            "name": "Eternal Bloom Necklace",
            "slug": "eternal-bloom-necklace",
            "description": "A timeless floral-inspired necklace crafted with 18K gold plating and Swarovski crystals.",
            "short_description": "Floral-inspired 18K gold necklace",
            "price": Decimal("45000.00"),
            "compare_at_price": Decimal("52000.00"),
            "sku": "TAR-NCK-001",
            "stock_quantity": 15,
            "material": "18K Gold Plated, Swarovski Crystals",
            "is_featured": True,
            "is_new_arrival": True,
            "category": categories[0],
            "images": [
                {"url": "/images/butterfly-necklace.png", "alt_text": "Eternal Bloom Necklace", "is_primary": True, "sort_order": 0},
                {"url": "/images/layered-necklaces.png", "alt_text": "Eternal Bloom Alternate", "is_primary": False, "sort_order": 1},
            ],
            "variants": [],
        },
        {
            "name": "Royal Drop Earrings",
            "slug": "royal-drop-earrings",
            "description": "Regal drop earrings with champagne gold finish and pearl accents.",
            "short_description": "Champagne gold drop earrings with pearls",
            "price": Decimal("28000.00"),
            "compare_at_price": None,
            "sku": "TAR-ERR-001",
            "stock_quantity": 20,
            "material": "Champagne Gold, Freshwater Pearls",
            "is_featured": True,
            "is_new_arrival": False,
            "category": categories[1],
            "images": [
                {"url": "/images/gold-hoops.png", "alt_text": "Royal Drop Earrings", "is_primary": True, "sort_order": 0},
                {"url": "/images/drop-earrings.png", "alt_text": "Royal Drop Alternate", "is_primary": False, "sort_order": 1},
            ],
            "variants": [],
        },
        {
            "name": "Solitaire Promise Ring",
            "slug": "solitaire-promise-ring",
            "description": "A delicate solitaire ring symbolizing eternal love, set with a brilliant-cut cubic zirconia.",
            "short_description": "Delicate solitaire promise ring",
            "price": Decimal("35000.00"),
            "compare_at_price": Decimal("42000.00"),
            "sku": "TAR-RNG-001",
            "stock_quantity": 10,
            "material": "Sterling Silver, Cubic Zirconia",
            "is_featured": True,
            "is_new_arrival": True,
            "category": categories[2],
            "images": [
                {"url": "/images/crown-ring.png", "alt_text": "Solitaire Promise Ring", "is_primary": True, "sort_order": 0},
                {"url": "/images/gold-rings-dark.png", "alt_text": "Solitaire Promise Alternate", "is_primary": False, "sort_order": 1},
            ],
            "variants": [
                {"name": "Size 6", "sku": "TAR-RNG-001-06", "stock_quantity": 3, "price_adjustment": Decimal("0.00")},
                {"name": "Size 7", "sku": "TAR-RNG-001-07", "stock_quantity": 4, "price_adjustment": Decimal("0.00")},
                {"name": "Size 8", "sku": "TAR-RNG-001-08", "stock_quantity": 3, "price_adjustment": Decimal("0.00")},
            ],
        },
        {
            "name": "Heritage Bangle Set",
            "slug": "heritage-bangle-set",
            "description": "Set of 3 heritage-inspired bangles with intricate African motifs.",
            "short_description": "Set of 3 heritage bangles",
            "price": Decimal("32000.00"),
            "compare_at_price": None,
            "sku": "TAR-BRC-001",
            "stock_quantity": 12,
            "material": "Gold Vermeil",
            "is_featured": False,
            "is_new_arrival": True,
            "category": categories[3],
            "images": [
                {"url": "/images/wave-cuff.png", "alt_text": "Heritage Bangle Set", "is_primary": True, "sort_order": 0},
                {"url": "/images/gold-bracelets.png", "alt_text": "Heritage Bangle Alternate", "is_primary": False, "sort_order": 1},
            ],
            "variants": [],
        },
        {
            "name": "Bridal Elegance Set",
            "slug": "bridal-elegance-set",
            "description": "Complete bridal jewelry set including necklace, earrings, and bracelet.",
            "short_description": "Complete bridal jewelry set",
            "price": Decimal("125000.00"),
            "compare_at_price": Decimal("150000.00"),
            "sku": "TAR-BRD-001",
            "stock_quantity": 5,
            "material": "18K Gold, Diamonds",
            "is_featured": True,
            "is_new_arrival": False,
            "category": categories[4],
            "images": [
                {"url": "/images/bridal-necklace.png", "alt_text": "Bridal Elegance Set", "is_primary": True, "sort_order": 0},
                {"url": "/images/pearl-bracelets.png", "alt_text": "Bridal Elegance Alternate", "is_primary": False, "sort_order": 1},
            ],
            "variants": [],
        },
        {
            "name": "Ethereal Wings Diamond Choker",
            "slug": "ethereal-wings-diamond-choker",
            "description": "A masterpiece of Nigerian craftsmanship, featuring our signature butterfly monogram encrusted with brilliant-cut diamonds.",
            "short_description": "Butterfly monogram diamond choker",
            "price": Decimal("85000.00"),
            "compare_at_price": None,
            "sku": "TAR-CHK-001",
            "stock_quantity": 8,
            "material": "18K Gold, Diamonds",
            "is_featured": True,
            "is_new_arrival": True,
            "category": categories[0],
            "images": [
                {"url": "/images/ethereal-wings-choker.png", "alt_text": "Ethereal Wings Diamond Choker", "is_primary": True, "sort_order": 0},
                {"url": "/images/ethereal-wings-sketch.png", "alt_text": "Ethereal Wings Detail", "is_primary": False, "sort_order": 1},
            ],
            "variants": [],
        },
        {
            "name": "Emerald Pendant Necklace",
            "slug": "emerald-pendant-necklace",
            "description": "Stunning emerald drop pendant on a delicate gold chain.",
            "short_description": "Emerald drop pendant necklace",
            "price": Decimal("58000.00"),
            "compare_at_price": Decimal("65000.00"),
            "sku": "TAR-NCK-002",
            "stock_quantity": 7,
            "material": "18K Gold, Emerald",
            "is_featured": False,
            "is_new_arrival": True,
            "category": categories[0],
            "images": [
                {"url": "/images/emerald-pendant.png", "alt_text": "Emerald Pendant Necklace", "is_primary": True, "sort_order": 0},
                {"url": "/images/beaded-necklace.png", "alt_text": "Emerald Pendant Alternate", "is_primary": False, "sort_order": 1},
            ],
            "variants": [],
        },
        {
            "name": "Diamond Choker",
            "slug": "diamond-choker",
            "description": "Elegant diamond choker for special occasions.",
            "short_description": "Elegant diamond choker",
            "price": Decimal("72000.00"),
            "compare_at_price": None,
            "sku": "TAR-CHK-002",
            "stock_quantity": 6,
            "material": "Platinum, Diamonds",
            "is_featured": True,
            "is_new_arrival": False,
            "category": categories[0],
            "images": [
                {"url": "/images/diamond-choker.png", "alt_text": "Diamond Choker", "is_primary": True, "sort_order": 0},
                {"url": "/images/butterfly-pendant-cushion.png", "alt_text": "Diamond Choker Alternate", "is_primary": False, "sort_order": 1},
            ],
            "variants": [],
        },
    ]

    for p in products_data:
        category = p.pop("category")
        images = p.pop("images")
        variants = p.pop("variants")
        product = Product(**p, category_id=category.id)
        db.add(product)
        await db.flush()
        for img in images:
            db.add(ProductImage(product_id=product.id, **img))
        for var in variants:
            db.add(ProductVariant(product_id=product.id, **var))
    await db.commit()


async def seed_banners(db: AsyncSession):
    banners = [
        Banner(
            title="Timeless Elegance",
            subtitle="Discover our new collection of handcrafted Nigerian jewelry",
            image="/images/hero.png",
            cta_text="Shop Collection",
            cta_link="/products",
            position=BannerPosition.HERO,
            sort_order=0,
        ),
        Banner(
            title="Bridal Dreams",
            subtitle="Make your special day unforgettable with our bridal sets",
            image="/images/bridal-necklace.png",
            cta_text="Explore Bridal",
            cta_link="/categories/bridal-sets",
            position=BannerPosition.PROMO,
            sort_order=0,
        ),
    ]
    for b in banners:
        db.add(b)
    await db.commit()


async def seed_admin(db: AsyncSession):
    admin = User(
        id=str(uuid.uuid4()),
        email="admin@tareejewelry.com",
        password_hash=hash_password("Admin@1234"),
        first_name="Admin",
        last_name="User",
        role="superadmin",
        email_verified=True,
    )
    db.add(admin)
    await db.commit()


async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as db:
        categories = await seed_categories(db)
        await seed_products(db, categories)
        await seed_banners(db)
        await seed_admin(db)
        print("✅ Seeding complete!")


if __name__ == "__main__":
    asyncio.run(main())
