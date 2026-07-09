#!/usr/bin/env python3
"""Local test script for TJ WhatsApp bot.
Simulates Twilio webhooks without needing internet/Twilio/ngrok.
"""
import httpx
import sys

BASE_URL = "http://127.0.0.1:8001/webhook"
FROM = "whatsapp:+2349037140827"


def send_msg(body: str, media_urls: list = None):
    data = {
        "From": FROM,
        "Body": body,
        "NumMedia": len(media_urls or []),
    }
    if media_urls:
        for i, url in enumerate(media_urls):
            data[f"MediaUrl{i}"] = url

    try:
        r = httpx.post(BASE_URL, data=data, timeout=30)
        print(f"  -> Status: {r.status_code}")
    except Exception as e:
        print(f"  -> ERROR: {e}")


def main():
    print("TJ Local Test\n")
    print("Make sure the bot is running: uvicorn app.main:app --port 8001\n")

    # Option 1: Product upload flow
    print("1. Test product upload flow")
    print("2. Test order check")
    print("3. Custom message")
    choice = input("\nPick (1/2/3): ").strip()

    if choice == "1":
        print("\n--- Starting product upload ---")
        send_msg("upload product")

        input("\nPress Enter after TJ asks for the image...")
        # Simulate sending an image URL (use an existing product image)
        send_msg("", media_urls=["http://localhost:5173/images/hero-portrait.jpeg"])

        name = input("\nProduct name: ")
        send_msg(name)

        material = input("Material (e.g., Gold): ")
        send_msg(material)

        price = input("Price (e.g., 50000): ")
        send_msg(price)

        weight = input("Weight in grams (e.g., 15): ")
        send_msg(weight)

        stock = input("Stock quantity (e.g., 10): ")
        send_msg(stock)

        category = input("Category (e.g., necklaces): ")
        send_msg(category)

        description = input("Description: ")
        send_msg(description)

        print("\n✅ Product upload flow complete. Check the backend for the new product.")

    elif choice == "2":
        print("\n--- Checking orders ---")
        send_msg("orders")

    elif choice == "3":
        msg = input("Message to send: ")
        send_msg(msg)

    else:
        print("Invalid choice")


if __name__ == "__main__":
    main()
