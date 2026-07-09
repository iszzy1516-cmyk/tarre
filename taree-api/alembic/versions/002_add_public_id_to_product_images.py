"""Add public_id to product_images

Revision ID: 002
Revises: 001
Create Date: 2026-05-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("product_images", sa.Column("public_id", sa.String(200), nullable=True))


def downgrade() -> None:
    op.drop_column("product_images", "public_id")
