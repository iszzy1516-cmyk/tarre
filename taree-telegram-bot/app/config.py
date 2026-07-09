from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    backend_url: str = "http://127.0.0.1:8000/api/v1"
    bot_api_key: str = "change-me-in-production"
    telegram_bot_token: str = ""
    admin_chat_id: str = ""
    poll_interval_seconds: int = 30
    database_url: str = "sqlite:///./telegram_bot.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
