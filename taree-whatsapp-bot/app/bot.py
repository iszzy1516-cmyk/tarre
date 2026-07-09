import re
import traceback
import time
from app import state, backend_client, twilio_client, order_poller
from app.config import settings


def _fmt_phone(num: str) -> str:
    num = num.replace("whatsapp:", "").strip()
    if not num.startswith("+"):
        num = "+" + num
    return num


def _is_admin(phone: str) -> bool:
    return phone == settings.admin_whatsapp_number


async def handle_message(from_number: str, body: str, media_urls: list[str]):
    phone = _fmt_phone(from_number)
    text = body.strip().lower()
    session = state.get_session(phone)

    # Security: only respond to admin
    if not _is_admin(phone):
        return

    # Global commands
    if text in ["cancel", "exit", "stop"]:
        state.clear_session(phone)
        twilio_client.send_text(phone, "Cancelled. Send *upload* to add a product.")
        return

    if text in ["alerts on", "notify on"]:
        order_poller.toggle_alerts(True)
        twilio_client.send_text(phone, "Order alerts enabled.")
        return

    if text in ["alerts off", "notify off"]:
        order_poller.toggle_alerts(False)
        twilio_client.send_text(phone, "Order alerts disabled.")
        return

    if text in ["upload product", "new product", "add product", "upload"]:
        state.set_session(phone, "awaiting_image", {})
        twilio_client.send_text(phone, "Send the product photo.")
        return

    if text in ["orders", "check orders", "new orders"]:
        await _send_recent_orders(phone)
        return

    if text in ["help", "menu", "commands", "hi", "hello"]:
        twilio_client.send_text(
            phone,
            "*TJ Commands*\n\n"
            "upload — Add a product\n"
            "orders — See recent orders\n"
            "alerts on/off — Toggle order alerts\n"
            "cancel — Cancel upload\n"
            "help — Show this menu",
        )
        return

    # State machine
    if session.state == "idle":
        twilio_client.send_text(phone, "Send *upload* to add a product, or *help* for options.")
        return

    if session.state == "awaiting_image":
        if media_urls:
            session.data["image_url"] = media_urls[0]
            state.set_session(phone, "awaiting_name", session.data)
            twilio_client.send_text(phone, "Product name?")
        else:
            twilio_client.send_text(phone, "Please send a photo.")
        return

    if session.state == "awaiting_name":
        session.data["name"] = body.strip()
        state.set_session(phone, "awaiting_material", session.data)
        twilio_client.send_text(phone, "Material? (Gold, Silver, etc)")
        return

    if session.state == "awaiting_material":
        session.data["material"] = body.strip()
        state.set_session(phone, "awaiting_price", session.data)
        twilio_client.send_text(phone, "Price in Naira?")
        return

    if session.state == "awaiting_price":
        price = _extract_number(body)
        if price is None:
            twilio_client.send_text(phone, "Enter a valid number.")
            return
        session.data["price"] = price
        state.set_session(phone, "awaiting_weight", session.data)
        twilio_client.send_text(phone, "Weight in grams?")
        return

    if session.state == "awaiting_weight":
        weight = _extract_number(body)
        if weight is None:
            twilio_client.send_text(phone, "Enter a valid number.")
            return
        session.data["weight_grams"] = weight
        state.set_session(phone, "awaiting_stock", session.data)
        twilio_client.send_text(phone, "Stock quantity?")
        return

    if session.state == "awaiting_stock":
        stock = _extract_int(body)
        if stock is None:
            twilio_client.send_text(phone, "Enter a whole number.")
            return
        session.data["stock_quantity"] = stock
        state.set_session(phone, "awaiting_category", session.data)
        try:
            cats = await backend_client.get_categories()
            cat_list = ", ".join([c["name"] for c in cats[:8]])
            twilio_client.send_text(phone, f"Category? Options: {cat_list}")
        except Exception:
            twilio_client.send_text(phone, "Category? (necklaces, rings, bracelets, earrings)")
        return

    if session.state == "awaiting_category":
        session.data["category"] = body.strip()
        state.set_session(phone, "awaiting_description", session.data)
        twilio_client.send_text(phone, "Short description?")
        return

    if session.state == "awaiting_description":
        session.data["description"] = body.strip()
        await _create_product(phone, session.data)
        return

    twilio_client.send_text(phone, "Didn't understand. Send *help* for options.")


async def _create_product(phone: str, data: dict):
    twilio_client.send_text(phone, "Creating product...")

    try:
        image_url = await backend_client.upload_image_to_cloudinary(data["image_url"])

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

        state.clear_session(phone)
        twilio_client.send_text(
            phone,
            f"Done! {data['name']} added.\n"
            f"Price: N{data['price']:,.0f}\n"
            f"Stock: {data['stock_quantity']}\n\n"
            f"Send *upload* to add another.",
        )
    except Exception as e:
        tb = traceback.format_exc()
        print(f"[TJ PRODUCT ERROR] {e}\n{tb}")
        err = str(e)[:150] if str(e) else type(e).__name__
        # Try to extract backend detail from httpx error
        from httpx import HTTPStatusError
        if isinstance(e, HTTPStatusError) and e.response:
            try:
                detail = e.response.json().get("detail", err)
                err = detail[:150]
            except Exception:
                pass
        twilio_client.send_text(phone, f"Error: {err}\n\nSend *upload* to retry.")


async def _send_recent_orders(phone: str):
    try:
        orders = await backend_client.get_orders()
        if not orders:
            twilio_client.send_text(phone, "No recent orders.")
            return

        msg = "*Recent Orders*\n\n"
        for o in orders[:5]:
            msg += f"#{o['order_number']} — N{o['total']:,.0f} — {o['status']}\n"
        twilio_client.send_text(phone, msg)
    except Exception as e:
        twilio_client.send_text(phone, f"Error fetching orders: {str(e)[:150]}")


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
