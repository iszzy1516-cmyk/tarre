import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import Response

from app import bot, order_poller
from app.config import settings

# Track processed message SIDs to prevent duplicates from Twilio retries
_seen_sids = set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(order_poller.poll_orders())
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app = FastAPI(title="TJ", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/webhook")
async def whatsapp_webhook(request: Request, background_tasks: BackgroundTasks):
    """Receive incoming WhatsApp messages from Twilio.
    Returns 200 OK immediately and processes in background to avoid Twilio timeout retries."""
    form = await request.form()
    message_sid = form.get("MessageSid", "")

    # Deduplicate: ignore retries of the same message
    if message_sid in _seen_sids:
        return Response(status_code=200)
    if message_sid:
        _seen_sids.add(message_sid)
        # Keep set from growing forever
        if len(_seen_sids) > 1000:
            _seen_sids.clear()

    from_number = form.get("From", "")
    body = form.get("Body", "")
    num_media = int(form.get("NumMedia", 0))

    media_urls = []
    for i in range(num_media):
        url = form.get(f"MediaUrl{i}")
        if url:
            media_urls.append(url)

    # Process asynchronously so Twilio gets 200 OK immediately
    background_tasks.add_task(bot.handle_message, from_number, body, media_urls)
    return Response(status_code=200)


@app.get("/webhook")
def whatsapp_webhook_verify():
    return {"message": "TJ webhook active"}
