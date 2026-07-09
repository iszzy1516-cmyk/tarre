from app.config import settings
from app.utils.security import hash_password, verify_password, create_access_token, create_refresh_token


class AuthService:
    @staticmethod
    def validate_password(password: str) -> bool:
        """Minimum 8 chars, 1 uppercase, 1 number, 1 special char."""
        if len(password) < 8:
            return False
        if not any(c.isupper() for c in password):
            return False
        if not any(c.isdigit() for c in password):
            return False
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            return False
        return True

    @staticmethod
    def hash_password(password: str) -> str:
        return hash_password(password)

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        return verify_password(password, hashed)

    @staticmethod
    def create_tokens(user_id: str, role: str = "customer") -> dict:
        access_token = create_access_token({"sub": user_id, "role": role})
        refresh_token = create_refresh_token({"sub": user_id})
        return {"access_token": access_token, "refresh_token": refresh_token}


auth_service = AuthService()
