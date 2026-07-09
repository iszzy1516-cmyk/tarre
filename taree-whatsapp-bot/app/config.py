from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    backend_url: str = "http://127.0.0.1:8000/api/v1"
    bot_api_key: str = "change-me-in-production"
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_number: str = ""
    admin_whatsapp_number: str = ""
    poll_interval_seconds: int = 30
    database_url: str = "sqlite:///./whatsapp_bot.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
