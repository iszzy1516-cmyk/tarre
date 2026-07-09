from app.config import settings


class EmailService:
    def __init__(self):
        self.api_key = settings.resend_api_key
        self.from_email = settings.from_email

    async def send_order_confirmation(self, to: str, order_number: str, total: float) -> None:
        subject = f"Your TAREÉ Jewelry Order Confirmation - {order_number}"
        body = f"""
        <html>
        <body style="font-family: Georgia, serif; color: #1a1f2e;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
                <h1 style="color: #d4af37;">TAREÉ Jewelry</h1>
                <h2>Order Confirmation</h2>
                <p>Thank you for your order, <strong>{order_number}</strong>.</p>
                <p>Total: ₦{total:,.2f}</p>
                <p>We will notify you once your order has been shipped.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #666;">TAREÉ Jewelry — Handcrafted Luxury</p>
            </div>
        </body>
        </html>
        """
        await self._send(to, subject, body)

    async def send_welcome(self, to: str, first_name: str) -> None:
        subject = "Welcome to TAREÉ Jewelry"
        body = f"""
        <html>
        <body style="font-family: Georgia, serif; color: #1a1f2e;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
                <h1 style="color: #d4af37;">TAREÉ Jewelry</h1>
                <h2>Welcome, {first_name}!</h2>
                <p>We're delighted to have you join the TAREÉ family.</p>
                <p>Discover our handcrafted luxury jewelry designed for the modern African queen.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #666;">TAREÉ Jewelry — Handcrafted Luxury</p>
            </div>
        </body>
        </html>
        """
        await self._send(to, subject, body)

    async def send_email_verification(self, to: str, first_name: str, token: str) -> None:
        from app.config import settings
        verify_url = f"{settings.frontend_url}/verify-email?token={token}"
        subject = "Verify your TAREÉ Jewelry account"
        body = f"""
        <html>
        <body style="font-family: Georgia, serif; color: #1a1f2e;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
                <h1 style="color: #d4af37;">TAREÉ Jewelry</h1>
                <h2>Welcome, {first_name}!</h2>
                <p>Please verify your email by clicking the link below:</p>
                <a href="{verify_url}" style="display:inline-block;padding:12px 24px;background:#d4af37;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a>
                <p>Or copy and paste this URL: {verify_url}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #666;">TAREÉ Jewelry — Handcrafted Luxury</p>
            </div>
        </body>
        </html>
        """
        await self._send(to, subject, body)

    async def send_password_reset(self, to: str, first_name: str, token: str) -> None:
        from app.config import settings
        reset_url = f"{settings.frontend_url}/reset-password?token={token}"
        subject = "Reset your TAREÉ Jewelry password"
        body = f"""
        <html>
        <body style="font-family: Georgia, serif; color: #1a1f2e;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
                <h1 style="color: #d4af37;">TAREÉ Jewelry</h1>
                <h2>Password Reset</h2>
                <p>Hi {first_name},</p>
                <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                <a href="{reset_url}" style="display:inline-block;padding:12px 24px;background:#d4af37;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a>
                <p>Or copy and paste this URL: {reset_url}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #666;">TAREÉ Jewelry — Handcrafted Luxury</p>
            </div>
        </body>
        </html>
        """
        await self._send(to, subject, body)

    async def _send(self, to: str, subject: str, html: str) -> None:
        if not self.api_key:
            print(f"[EMAIL] To: {to}\nSubject: {subject}\n---")
            return

        try:
            import resend
            resend.api_key = self.api_key
            resend.Emails.send({
                "from": self.from_email,
                "to": to,
                "subject": subject,
                "html": html,
            })
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")


email_service = EmailService()
