import json
import sqlite3
from contextlib import contextmanager
from dataclasses import dataclass, asdict
from typing import Optional

from app.config import settings


def _init_db():
    with _get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                phone TEXT PRIMARY KEY,
                state TEXT NOT NULL DEFAULT 'idle',
                data TEXT DEFAULT '{}',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS notified_orders (
                order_id TEXT PRIMARY KEY,
                notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()


@contextmanager
def _get_conn():
    conn = sqlite3.connect(settings.database_url.replace("sqlite:///", ""), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


_init_db()


@dataclass
class SessionData:
    phone: str
    state: str = "idle"
    data: dict = None

    def __post_init__(self):
        if self.data is None:
            self.data = {}


def get_session(phone: str) -> SessionData:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT state, data FROM sessions WHERE phone = ?", (phone,)
        ).fetchone()
        if row:
            return SessionData(phone=phone, state=row["state"], data=json.loads(row["data"]))
        return SessionData(phone=phone)


def set_session(phone: str, state: str, data: Optional[dict] = None):
    with _get_conn() as conn:
        conn.execute(
            """
            INSERT INTO sessions (phone, state, data, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(phone) DO UPDATE SET
                state=excluded.state,
                data=excluded.data,
                updated_at=CURRENT_TIMESTAMP
            """,
            (phone, state, json.dumps(data or {})),
        )
        conn.commit()


def clear_session(phone: str):
    set_session(phone, "idle", {})


def is_order_notified(order_id: str) -> bool:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM notified_orders WHERE order_id = ?", (order_id,)
        ).fetchone()
        return row is not None


def mark_order_notified(order_id: str):
    with _get_conn() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO notified_orders (order_id) VALUES (?)",
            (order_id,),
        )
        conn.commit()
