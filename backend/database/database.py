import os

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .models import Cart, Category, Counter, Customer, Product, User

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/ecommerce")

client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global client
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URL)
    return client


async def init_db() -> None:
    db = get_client().get_default_database()
    await init_beanie(
        database=db,
        document_models=[Category, Product, Customer, Cart, User, Counter],
    )
