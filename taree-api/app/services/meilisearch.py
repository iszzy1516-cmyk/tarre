from app.config import settings


class MeilisearchService:
    def __init__(self):
        self.host = settings.meilisearch_host
        self.api_key = settings.meilisearch_api_key
        self._client = None

    def _get_client(self):
        if self._client is None:
            try:
                import meilisearch
                self._client = meilisearch.Client(self.host, self.api_key)
            except ImportError:
                return None
        return self._client

    async def init_index(self):
        client = self._get_client()
        if not client:
            return
        try:
            client.create_index("products", {"primaryKey": "id"})
        except Exception:
            pass  # Index may already exist

    async def index_products(self, products: list[dict]):
        client = self._get_client()
        if not client:
            return
        try:
            index = client.index("products")
            docs = [
                {
                    "id": p["id"],
                    "name": p["name"],
                    "slug": p["slug"],
                    "description": p.get("description", ""),
                    "short_description": p.get("short_description", ""),
                    "price": float(p.get("price", 0)),
                    "material": p.get("material", ""),
                    "category": p.get("category", ""),
                    "is_featured": p.get("is_featured", False),
                    "is_new_arrival": p.get("is_new_arrival", False),
                }
                for p in products
            ]
            index.add_documents(docs)
        except Exception as e:
            print(f"[MEILISEARCH] Index error: {e}")

    async def search(self, query: str, limit: int = 20):
        client = self._get_client()
        if not client:
            return None
        try:
            index = client.index("products")
            return index.search(query, {"limit": limit})
        except Exception as e:
            print(f"[MEILISEARCH] Search error: {e}")
            return None


meilisearch_service = MeilisearchService()
