import hashlib
import hmac
import httpx
from app.config import settings

FLW_BASE = "https://api.flutterwave.com/v3"


class FlutterwaveService:
    def __init__(self):
        self.secret_key = settings.flutterwave_secret_key
        self.headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json",
        }

    async def initialize(self, email: str, amount: float, tx_ref: str, redirect_url: str) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{FLW_BASE}/payments",
                headers=self.headers,
                json={
                    "tx_ref": tx_ref,
                    "amount": amount,
                    "currency": "NGN",
                    "redirect_url": redirect_url,
                    "customer": {"email": email},
                },
            )
            resp.raise_for_status()
            return resp.json()["data"]

    async def verify(self, tx_ref: str) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{FLW_BASE}/transactions/verify_by_reference?tx_ref={tx_ref}",
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()["data"]

    def verify_webhook(self, payload: bytes, signature: str | None) -> bool:
        if not signature or not self.secret_key:
            return False
        expected = hmac.new(
            self.secret_key.encode("utf-8"),
            payload,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)


flutterwave = FlutterwaveService()
