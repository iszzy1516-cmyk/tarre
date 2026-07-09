import httpx
from app.config import settings

HEADERS = {"x-bot-api-key": settings.bot_api_key, "Content-Type": "application/json"}


async def create_product(payload: dict) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.backend_url}/bot/products",
            json=payload,
            headers=HEADERS,
        )
        resp.raise_for_status()
        return resp.json()


async def get_categories() -> list:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.backend_url}/categories",
            headers=HEADERS,
        )
        resp.raise_for_status()
        return resp.json()


async def get_orders() -> list:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.backend_url}/bot/orders",
            headers=HEADERS,
        )
        resp.raise_for_status()
        return resp.json()


async def upload_image_bytes(image_bytes: bytes, filename: str = "product.jpg") -> str:
    """Upload image bytes directly to backend/Cloudinary."""
    async with httpx.AsyncClient() as client:
        upload_resp = await client.post(
            f"{settings.backend_url}/bot/upload-image",
            files={"file": (filename, image_bytes, "image/jpeg")},
            headers={"x-bot-api-key": settings.bot_api_key},
        )
        upload_resp.raise_for_status()
        return upload_resp.json()["url"]


async def add_product_image(product_id: str, image_url: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.backend_url}/bot/products/{product_id}/images",
            json={"url": image_url, "is_primary": True},
            headers=HEADERS,
        )
        resp.raise_for_status()
        return resp.json()
