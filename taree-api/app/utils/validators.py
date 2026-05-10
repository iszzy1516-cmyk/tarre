import re


def validate_nigerian_phone(phone: str) -> bool:
    pattern = r"^(\+234|0)[7-9][0-1][0-9]{8}$"
    return bool(re.match(pattern, phone))


def validate_password_strength(password: str) -> bool:
    """Minimum 8 chars, 1 uppercase, 1 number, 1 special char"""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-=+\[\];'/`~]", password):
        return False
    return True
