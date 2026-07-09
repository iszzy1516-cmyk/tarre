import cloudinary
import cloudinary.uploader
from app.config import settings


class CloudinaryService:
    def __init__(self):
        self.configured = bool(
            settings.cloudinary_cloud_name
            and settings.cloudinary_api_key
            and settings.cloudinary_api_secret
        )
        if self.configured:
            cloudinary.config(
                cloud_name=settings.cloudinary_cloud_name,
                api_key=settings.cloudinary_api_key,
                api_secret=settings.cloudinary_api_secret,
            )

    async def upload_image(self, file_bytes: bytes, folder: str = "taree_products") -> dict:
        if not self.configured:
            return {"url": "", "public_id": "", "error": "Cloudinary not configured"}

        try:
            result = cloudinary.uploader.upload(
                file_bytes,
                folder=folder,
                transformation=[
                    {"width": 600, "crop": "limit"},
                    {"fetch_format": "auto", "quality": "auto"},
                ],
            )
            return {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id"),
            }
        except Exception as e:
            return {"url": "", "public_id": "", "error": str(e)}

    async def delete_image(self, public_id: str) -> bool:
        if not self.configured:
            return False
        try:
            cloudinary.uploader.destroy(public_id)
            return True
        except Exception:
            return False


cloudinary_service = CloudinaryService()
