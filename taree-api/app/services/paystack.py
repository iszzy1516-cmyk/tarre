import httpx
from app.config import settings

PAYSTACK_BASE = "https://api.paystack.co"


class PaystackService:
    def __init__(self):
        self.secret_key = settings.paystack_secret_key
        self.headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json",
        }

    async def initialize(self, email: str, amount: int, reference: str, callback_url: str) -> dict:
        """amount in kobo"""
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{PAYSTACK_BASE}/transaction/initialize",
                headers=self.headers,
                json={
                    "email": email,
                    "amount": amount,
                    "reference": reference,
                    "callback_url": callback_url,
                },
            )
            resp.raise_for_status()
            return resp.json()["data"]

    async def verify(self, reference: str) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{PAYSTACK_BASE}/transaction/verify/{reference}",
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()["data"]

    def verify_webhook(self, payload: bytes, signature: str) -> bool:
        import hmac
        import hashlib

        expected = hmac.new(
            self.secret_key.encode(),
            payload,
            hashlib.sha512,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)


paystack = PaystackService()
