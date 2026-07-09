import asyncio
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
)

from app.config import settings
from app import bot as bot_module, order_poller


async def _post_init(app: Application):
    """Start background tasks after PTB initializes."""
    order_poller.set_application(app)
    app.create_task(order_poller.poll_orders(), name="order_poller")
    print("[TJ] Order poller started.")


def main():
    if not settings.telegram_bot_token:
        print("[TJ] ERROR: TELEGRAM_BOT_TOKEN not set. Get one from @BotFather.")
        return
    if not settings.admin_chat_id:
        print("[TJ] WARNING: ADMIN_CHAT_ID not set. Only you can use this bot.")
        print("[TJ] Start the bot, send /start, and check the console for your chat ID.")

    print("[TJ] Starting Telegram bot...")

    application = (
        Application.builder()
        .token(settings.telegram_bot_token)
        .post_init(_post_init)
        .build()
    )

    # Command handlers
    application.add_handler(CommandHandler("start", bot_module.handle_start))
    application.add_handler(CommandHandler("help", bot_module.handle_start))
    application.add_handler(CommandHandler("upload", bot_module.handle_upload))
    application.add_handler(CommandHandler("orders", bot_module.handle_orders))
    application.add_handler(CommandHandler("alertson", bot_module.handle_alerts_on))
    application.add_handler(CommandHandler("alertsoff", bot_module.handle_alerts_off))
    application.add_handler(CommandHandler("cancel", bot_module.handle_cancel))

    # Photo handler
    application.add_handler(MessageHandler(filters.PHOTO, bot_module.handle_photo))

    # Text handler (non-command)
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, bot_module.handle_text)
    )

    application.run_polling(allowed_updates=Update.ALL_TYPES)
    print("[TJ] Stopped.")


if __name__ == "__main__":
    main()
