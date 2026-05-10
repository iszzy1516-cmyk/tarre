#!/usr/bin/env python3
"""Quick local startup using SQLite for demo purposes."""
import asyncio
import os
import sys

# Ensure project root is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Override DB to SQLite for quick local demo
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./taree_local.db"

from app.database import engine, Base, async_session_maker
from scripts.seed import seed_categories, seed_products, seed_banners, seed_admin


async def setup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as db:
        categories = await seed_categories(db)
        await seed_products(db, categories)
        await seed_banners(db)
        await seed_admin(db)
        print("✅ Database seeded!")


if __name__ == "__main__":
    asyncio.run(setup())
    print("\n🚀 Starting server on http://localhost:8000")
    print("📖 API docs: http://localhost:8000/docs")
    print("   Health:  http://localhost:8000/health")
    print("   Admin:   admin@tareejewelry.com / Admin@1234")
    print("\nPress Ctrl+C to stop\n")
    os.system("uvicorn app.main:app --reload")
