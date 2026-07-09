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


async def upload_image_to_cloudinary(image_url: str) -> str:
    """Download image from Twilio media URL and upload to Cloudinary via backend."""
    async with httpx.AsyncClient() as client:
        # Download the image bytes from Twilio (requires Basic Auth)
        img_resp = await client.get(
            image_url,
            auth=(settings.twilio_account_sid, settings.twilio_auth_token),
        )
        img_resp.raise_for_status()

        # Upload to backend/Cloudinary
        upload_resp = await client.post(
            f"{settings.backend_url}/bot/upload-image",
            files={"file": ("product.jpg", img_resp.content, img_resp.headers.get("content-type", "image/jpeg"))},
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
