"""Telegram message helpers."""
from telegram import Update
from telegram.ext import ContextTypes
from app.config import settings


async def send_text(chat_id: str | int, text: str, context: ContextTypes.DEFAULT_TYPE = None):
    """Send a text message to a chat."""
    if context and context.bot:
        await context.bot.send_message(chat_id=chat_id, text=text, parse_mode="Markdown")
    else:
        print(f"[TJ MOCK TO {chat_id}]: {text[:80]}...")


async def send_photo(chat_id: str | int, photo_bytes: bytes, caption: str = "", context: ContextTypes.DEFAULT_TYPE = None):
    """Send a photo to a chat."""
    if context and context.bot:
        await context.bot.send_photo(chat_id=chat_id, photo=photo_bytes, caption=caption, parse_mode="Markdown")
    else:
        print(f"[TJ MOCK PHOTO TO {chat_id}]: {len(photo_bytes)} bytes")
