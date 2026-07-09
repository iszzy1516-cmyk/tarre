from app.config import settings


class WhatsAppService:
    def __init__(self):
        self.account_sid = settings.twilio_account_sid
        self.auth_token = settings.twilio_auth_token
        self.from_number = settings.twilio_whatsapp_number

    async def send_order_notification(self, to: str, order_number: str, total: float) -> None:
        if not self.account_sid or not self.auth_token:
            print(f"[WHATSAPP] To: {to} | Order: {order_number} | Total: ₦{total:,.2f}")
            return

        try:
            from twilio.rest import Client
            client = Client(self.account_sid, self.auth_token)
            message = client.messages.create(
                from_=self.from_number,
                body=f"🛍️ TAREÉ Jewelry\nYour order {order_number} has been confirmed.\nTotal: ₦{total:,.2f}\nWe'll notify you once shipped.",
                to=f"whatsapp:{to}",
            )
            print(f"[WHATSAPP] Sent SID: {message.sid}")
        except Exception as e:
            print(f"[WHATSAPP ERROR] {e}")

    async def send_shipping_notification(self, to: str, order_number: str, tracking_number: str) -> None:
        if not self.account_sid or not self.auth_token:
            print(f"[WHATSAPP] Shipping: Order {order_number} | Tracking: {tracking_number}")
            return

        try:
            from twilio.rest import Client
            client = Client(self.account_sid, self.auth_token)
            message = client.messages.create(
                from_=self.from_number,
                body=f"📦 TAREÉ Jewelry\nYour order {order_number} has shipped!\nTracking: {tracking_number}",
                to=f"whatsapp:{to}",
            )
            print(f"[WHATSAPP] Sent SID: {message.sid}")
        except Exception as e:
            print(f"[WHATSAPP ERROR] {e}")


whatsapp_service = WhatsAppService()
