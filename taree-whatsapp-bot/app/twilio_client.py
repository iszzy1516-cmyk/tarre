from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from app.config import settings

_client: Client | None = None


def _get_client() -> Client:
    global _client
    if _client is None:
        _client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
    return _client


def send_text(to: str, body: str) -> str:
    if not settings.twilio_whatsapp_number:
        print(f"[TJ MOCK TO {to}]: {body[:80]}...")
        return "mock-sid"
    try:
        client = _get_client()
        msg = client.messages.create(
            from_=f"whatsapp:{settings.twilio_whatsapp_number}",
            body=body,
            to=f"whatsapp:{to}",
        )
        return msg.sid
    except TwilioRestException as e:
        print(f"[TJ TWILIO ERROR] {e.status} {e.msg}")
        return ""
    except Exception as e:
        print(f"[TJ TWILIO ERROR] {e}")
        return ""


def send_image(to: str, image_url: str, caption: str = "") -> str:
    if not settings.twilio_whatsapp_number:
        print(f"[TJ MOCK IMAGE TO {to}]: {image_url}")
        return "mock-sid"
    try:
        client = _get_client()
        msg = client.messages.create(
            from_=f"whatsapp:{settings.twilio_whatsapp_number}",
            media_url=[image_url],
            body=caption,
            to=f"whatsapp:{to}",
        )
        return msg.sid
    except TwilioRestException as e:
        print(f"[TJ TWILIO ERROR] {e.status} {e.msg}")
        return ""
    except Exception as e:
        print(f"[TJ TWILIO ERROR] {e}")
        return ""
