import asyncio
from datetime import datetime, timezone, timedelta
from telegram.ext import Application

from app import state, backend_client
from app.config import settings

_BOT_START_TIME = datetime.now(timezone.utc)
_ALERTS_ENABLED = True
_app: Application | None = None


def set_application(app: Application):
    global _app
    _app = app


def toggle_alerts(enabled: bool):
    global _ALERTS_ENABLED
    _ALERTS_ENABLED = enabled


def are_alerts_enabled() -> bool:
    return _ALERTS_ENABLED


async def poll_orders():
    """Background task: poll backend for NEW orders and notify admin once."""
    await asyncio.sleep(10)
    while True:
        await asyncio.sleep(settings.poll_interval_seconds)
        if not _ALERTS_ENABLED:
            continue
        if not _app:
            continue
        try:
            orders = await backend_client.get_orders()
            for order in orders:
                oid = order.get("id", "")
                if state.is_order_notified(oid):
                    continue

                # Only notify orders created after the bot started
                created_str = order.get("created_at", "")
                if created_str:
                    try:
                        created = datetime.fromisoformat(created_str.replace("Z", "+00:00"))
                        if created < _BOT_START_TIME - timedelta(minutes=1):
                            state.mark_order_notified(oid)
                            continue
                    except Exception:
                        pass

                # Only notify pending/processing/paid orders
                status = str(order.get("status", "")).lower()
                payment = str(order.get("payment_status", "")).lower()
                if status not in ("pending", "processing", "shipped", "paid") and payment != "paid":
                    state.mark_order_notified(oid)
                    continue

                await _notify_admin(order)
                state.mark_order_notified(oid)
        except Exception as e:
            print(f"[ORDER POLLER] Error: {e}")


async def _notify_admin(order: dict):
    if not settings.admin_chat_id or not _app:
        print(f"[ORDER POLLER] No admin configured. Order: {order.get('order_number')}")
        return

    addr = order.get("shipping_address") or {}
    items = order.get("items", [])
    items_text = "\n".join(
        [f"- {i.get('product_name', 'Item')} x{i.get('quantity', 1)} = N{i.get('total_price', 0):,.0f}" for i in items[:5]]
    )

    msg = (
        f"*New Order*\n"
        f"#{order.get('order_number', 'N/A')}\n\n"
        f"Total: N{order.get('total', 0):,.0f}\n"
        f"Status: {order.get('status', 'N/A')}\n"
        f"Payment: {order.get('payment_status', 'N/A')}\n\n"
        f"*Customer*\n"
        f"{addr.get('full_name', 'Guest')}\n"
        f"{addr.get('email', 'N/A')}\n"
        f"{addr.get('phone', 'N/A')}\n\n"
        f"*Address*\n"
        f"{addr.get('street', '')}\n"
        f"{addr.get('city', '')}, {addr.get('state', '')}\n\n"
        f"*Items*\n{items_text}"
    )

    await _app.bot.send_message(
        chat_id=settings.admin_chat_id,
        text=msg,
        parse_mode="Markdown",
    )
