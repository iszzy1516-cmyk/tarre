from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order, PaymentStatus
from app.schemas import PaymentInitializeSchema, PaymentVerifySchema
from app.services.paystack import paystack
from app.services.flutterwave import flutterwave
from app.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/initialize")
async def initialize_payment(
    data: PaymentInitializeSchema,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order)
        .where(Order.id == data.order_id)
        .options(selectinload(Order.user))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    email = data.email or (order.user.email if order.user else order.guest_email)
    if not email:
        raise HTTPException(status_code=400, detail="Email required for payment")

    reference = f"TAREE-{order.order_number}"
    callback_url = f"{settings.frontend_url}/payment/verify"

    if order.payment_method == "paystack":
        paystack_data = await paystack.initialize(
            email=email,
            amount=int(order.total * 100),
            reference=reference,
            callback_url=callback_url,
        )
        return {"authorization_url": paystack_data["authorization_url"], "reference": reference}

    elif order.payment_method == "flutterwave":
        flw_data = await flutterwave.initialize(
            email=email,
            amount=float(order.total),
            tx_ref=reference,
            redirect_url=callback_url,
        )
        return {"authorization_url": flw_data["link"], "reference": reference}

    else:
        raise HTTPException(status_code=400, detail="Unsupported payment method")


@router.post("/verify")
async def verify_payment(
    data: PaymentVerifySchema,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order).where(Order.payment_reference == data.reference)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        verification = await paystack.verify(data.reference)
        if verification["status"] == "success":
            order.payment_status = PaymentStatus.PAID
            await db.commit()
            return {"status": "success", "order_id": order.id}
    except Exception:
        pass

    order.payment_status = PaymentStatus.FAILED
    await db.commit()
    return {"status": "failed", "order_id": order.id}


@router.post("/webhook/paystack")
async def paystack_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    signature = request.headers.get("x-paystack-signature")

    if not signature or not paystack.verify_webhook(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    event = await request.json()
    if event.get("event") == "charge.success":
        reference = event["data"]["reference"]
        result = await db.execute(
            select(Order).where(Order.payment_reference == reference)
        )
        order = result.scalar_one_or_none()
        if order:
            order.payment_status = PaymentStatus.PAID
            await db.commit()

    return {"received": True}
