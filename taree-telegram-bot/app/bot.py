import re
import traceback
import time
from telegram import Update
from telegram.ext import ContextTypes

from app import state, backend_client, telegram_client, order_poller
from app.config import settings


def _is_admin(chat_id: str) -> bool:
    return chat_id == settings.admin_chat_id


def _fmt_chat_id(update: Update) -> str:
    return str(update.effective_chat.id)


async def handle_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = _fmt_chat_id(update)
    print(f"[TJ] /start from chat_id: {chat_id}", flush=True)
    if not _is_admin(chat_id):
        await telegram_client.send_text(
            chat_id,
            f"Your chat ID is: `{chat_id}`\n\nSend this to the admin to get access.",
            context,
        )
        return
    await telegram_client.send_text(
        chat_id,
        "*TJ Commands*\n\n"
        "/upload — Add a product\n"
        "/orders — See recent orders\n"
        "/alertson — Enable order alerts\n"
        "/alertsoff — Disable order alerts\n"
        "/cancel — Cancel upload\n"
        "/help — Show this menu",
        context,
    )


async def handle_upload(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = _fmt_chat_id(update)
    if not _is_admin(chat_id):
        return
    state.set_session(chat_id, "awaiting_image", {})
    await telegram_client.send_text(chat_id, "Send the product photo.", context)


async def handle_orders(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = _fmt_chat_id(update)
    if not _is_admin(chat_id):
        return
    await _send_recent_orders(chat_id, context)


async def handle_alerts_on(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = _fmt_chat_id(update)
    if not _is_admin(chat_id):
        return
    order_poller.toggle_alerts(True)
    await telegram_client.send_text(chat_id, "Order alerts enabled.", context)


async def handle_alerts_off(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = _fmt_chat_id(update)
    if not _is_admin(chat_id):
        return
    order_poller.toggle_alerts(False)
    await telegram_client.send_text(chat_id, "Order alerts disabled.", context)


async def handle_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = _fmt_chat_id(update)
    if not _is_admin(chat_id):
        return
    state.clear_session(chat_id)
    await telegram_client.send_text(chat_id, "Cancelled. Send /upload to add a product.", context)


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle incoming product photos."""
    chat_id = _fmt_chat_id(update)
    if not _is_admin(chat_id):
        return

    session = state.get_session(chat_id)
    if session.state != "awaiting_image":
        await telegram_client.send_text(chat_id, "Send /upload to add a product.", context)
        return

    await telegram_client.send_text(chat_id, "Downloading photo...", context)

    try:
        # Get the largest photo
        photo = update.message.photo[-1]
        file_obj = await context.bot.get_file(photo.file_id)
        image_bytes = await file_obj.download_as_bytearray()

        await telegram_client.send_text(chat_id, "Uploading to Cloudinary...", context)
        image_url = await backend_client.upload_image_bytes(bytes(image_bytes))

        session.data["image_url"] = image_url
        state.set_session(chat_id, "awaiting_name", session.data)
        await telegram_client.send_text(chat_id, "Photo uploaded!\nProduct name?", context)
    except Exception as e:
        print(f"[TJ PHOTO ERROR] {e}", flush=True)
        await telegram_client.send_text(chat_id, f"Error uploading photo: {str(e)[:150]}\nSend /upload to retry.", context)
        state.clear_session(chat_id)


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle text messages in the conversation flow."""
    chat_id = _fmt_chat_id(update)
    if not _is_admin(chat_id):
        return

    body = update.message.text or ""
    text = body.strip().lower()
    session = state.get_session(chat_id)

    # Global commands handled by dedicated handlers, but catch any stragglers
    if text in ["/cancel", "cancel"]:
        state.clear_session(chat_id)
        await telegram_client.send_text(chat_id, "Cancelled. Send /upload to add a product.", context)
        return

    # State machine
    if session.state == "idle":
        await telegram_client.send_text(
            chat_id, "Send /upload to add a product, or /help for options.", context
        )
        return

    if session.state == "awaiting_image":
        await telegram_client.send_text(chat_id, "Please send a photo.", context)
        return

    if session.state == "awaiting_name":
        session.data["name"] = body.strip()
        state.set_session(chat_id, "awaiting_material", session.data)
        await telegram_client.send_text(chat_id, "Material? (Gold, Silver, etc)", context)
        return

    if session.state == "awaiting_material":
        session.data["material"] = body.strip()
        state.set_session(chat_id, "awaiting_price", session.data)
        await telegram_client.send_text(chat_id, "Price in Naira?", context)
        return

    if session.state == "awaiting_price":
        price = _extract_number(body)
        if price is None:
            await telegram_client.send_text(chat_id, "Enter a valid number.", context)
            return
        session.data["price"] = price
        state.set_session(chat_id, "awaiting_weight", session.data)
        await telegram_client.send_text(chat_id, "Weight in grams?", context)
        return

    if session.state == "awaiting_weight":
        weight = _extract_number(body)
        if weight is None:
            await telegram_client.send_text(chat_id, "Enter a valid number.", context)
            return
        session.data["weight_grams"] = weight
        state.set_session(chat_id, "awaiting_stock", session.data)
        await telegram_client.send_text(chat_id, "Stock quantity?", context)
        return

    if session.state == "awaiting_stock":
        stock = _extract_int(body)
        if stock is None:
            await telegram_client.send_text(chat_id, "Enter a whole number.", context)
            return
        session.data["stock_quantity"] = stock
        state.set_session(chat_id, "awaiting_category", session.data)
        try:
            cats = await backend_client.get_categories()
            cat_list = ", ".join([c["name"] for c in cats[:8]])
            await telegram_client.send_text(chat_id, f"Category? Options: {cat_list}", context)
        except Exception:
            await telegram_client.send_text(
                chat_id, "Category? (necklaces, rings, bracelets, earrings)", context
            )
        return

    if session.state == "awaiting_category":
        session.data["category"] = body.strip()
        state.set_session(chat_id, "awaiting_description", session.data)
        await telegram_client.send_text(chat_id, "Short description?", context)
        return

    if session.state == "awaiting_description":
        session.data["description"] = body.strip()
        await _create_product(chat_id, session.data, context)
        return

    await telegram_client.send_text(
        chat_id, "Didn't understand. Send /help for options.", context
    )


async def _create_product(chat_id: str, data: dict, context: ContextTypes.DEFAULT_TYPE):
    await telegram_client.send_text(chat_id, "Creating product...", context)

    try:
        image_url = data["image_url"]

        cats = await backend_client.get_categories()
        category_id = None
        for c in cats:
            if data["category"].lower() in c["name"].lower() or c["name"].lower() in data["category"].lower():
                category_id = c["id"]
                break
        if not category_id and cats:
            category_id = cats[0]["id"]

        slug = re.sub(r"[^a-z0-9]+", "-", data["name"].lower()).strip("-")
        unique = str(int(time.time()))[-4:]
        slug = f"{slug}-{unique}"

        payload = {
            "name": data["name"],
            "slug": slug,
            "description": data["description"],
            "short_description": data["description"][:120],
            "price": data["price"],
            "sku": f"TAR-{unique}",
            "stock_quantity": data["stock_quantity"],
            "weight_grams": data.get("weight_grams"),
            "material": data["material"],
            "category_id": category_id,
            "is_featured": False,
            "is_new_arrival": True,
        }

        result = await backend_client.create_product(payload)
        product_id = result.get("id", "")

        if product_id:
            await backend_client.add_product_image(product_id, image_url)

        state.clear_session(chat_id)
        await telegram_client.send_text(
            chat_id,
            f"Done! *{data['name']}* added.\n"
            f"Price: N{data['price']:,.0f}\n"
            f"Stock: {data['stock_quantity']}\n\n"
            f"Send /upload to add another.",
            context,
        )
    except Exception as e:
        tb = traceback.format_exc()
        print(f"[TJ PRODUCT ERROR] {e}\n{tb}")
        err = str(e)[:150] if str(e) else type(e).__name__
        from httpx import HTTPStatusError
        if isinstance(e, HTTPStatusError) and e.response:
            try:
                detail = e.response.json().get("detail", err)
                err = detail[:150]
            except Exception:
                pass
        await telegram_client.send_text(
            chat_id, f"Error: {err}\n\nSend /upload to retry.", context
        )


async def _send_recent_orders(chat_id: str, context: ContextTypes.DEFAULT_TYPE):
    try:
        orders = await backend_client.get_orders()
        if not orders:
            await telegram_client.send_text(chat_id, "No recent orders.", context)
            return

        msg = "*Recent Orders*\n\n"
        for o in orders[:5]:
            msg += f"#{o['order_number']} — N{o['total']:,.0f} — {o['status']}\n"
        await telegram_client.send_text(chat_id, msg, context)
    except Exception as e:
        await telegram_client.send_text(
            chat_id, f"Error fetching orders: {str(e)[:150]}", context
        )


def _extract_number(text: str) -> float | None:
    nums = re.findall(r"[\d,]+\.?\d*", text.replace(",", ""))
    if nums:
        try:
            return float(nums[0])
        except ValueError:
            return None
    return None


def _extract_int(text: str) -> int | None:
    n = _extract_number(text)
    if n is not None:
        return int(n)
    return None
