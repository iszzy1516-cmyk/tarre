from pydantic import BaseModel, Field


class CategorySchema(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None
    image: str | None
    parent_id: str | None
    is_active: bool
    sort_order: int
    children: list["CategorySchema"] = Field(default_factory=list)

    class Config:
        from_attributes = True


class CategoryCreateSchema(BaseModel):
    name: str
    slug: str
    description: str | None = None
    image: str | None = None
    parent_id: str | None = None
    sort_order: int = 0
