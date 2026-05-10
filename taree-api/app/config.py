from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/taree_db"

    # Auth
    jwt_secret_key: str = "your-super-secret-key-min-32-chars-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # Frontend
    frontend_url: str = "http://localhost:5173"

    # Paystack
    paystack_secret_key: str = ""
    paystack_public_key: str = ""

    # Flutterwave
    flutterwave_secret_key: str = ""
    flutterwave_public_key: str = ""

    # Cloudinary
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    # Meilisearch
    meilisearch_host: str = "http://localhost:7700"
    meilisearch_api_key: str = ""

    # Email
    resend_api_key: str = ""
    from_email: str = "hello@tareejewelry.com"

    # Twilio / WhatsApp
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_number: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
