import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth, products, categories, orders, payments, admin, wishlist, users, cart, reviews, banners, bot
from app.limiter import limiter


def _run_alembic():
    try:
        from alembic.config import Config
        from alembic import command
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")
    except Exception:
        pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations first, then fallback to create_all
    await asyncio.to_thread(_run_alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="TAREÉ Jewelry API",
    description="Luxury Nigerian jewelry e-commerce platform",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter

_origins = [settings.frontend_url]
if settings.environment == "development":
    _origins.extend([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(_origins)),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(429)
async def rate_limit_handler(request, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )

import os

static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(payments.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(wishlist.router, prefix="/api/v1")
app.include_router(banners.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(bot.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
