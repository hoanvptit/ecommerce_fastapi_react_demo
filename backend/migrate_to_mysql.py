import asyncio
import os

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from database.models import Category, Counter, Product, User


async def seed_mongodb() -> None:
    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017/ecommerce")
    client = AsyncIOMotorClient(mongo_url)
    database = client.get_default_database()

    await init_beanie(database=database, document_models=[Category, Product, User, Counter])

    categories = [
        {"name": "phone"},
        {"name": "tv"},
        {"name": "macbook"},
        {"name": "earbuds"},
    ]

    for category in categories:
        exists = await Category.find_one(Category.name == category["name"])
        if exists is None:
            doc = Category(name=category["name"])
            doc.id = 1 if not await Category.find_all().to_list() else (await Category.find_all().to_list())[-1].id + 1
            await doc.insert()

    products = [
        {"name": "Phone 1.0", "price": 699.0, "category_id": 1},
        {"name": "Phone 2.0", "price": 799.0, "category_id": 1},
        {"name": "TV 1.0", "price": 799.0, "category_id": 2},
        {"name": "MacBook 1.0", "price": 1299.0, "category_id": 3},
        {"name": "Earbuds 1.0", "price": 199.0, "category_id": 4},
    ]

    for product in products:
        exists = await Product.find_one(Product.name == product["name"])
        if exists is None:
            doc = Product(
                name=product["name"],
                price=product["price"],
                category_id=product["category_id"],
            )
            doc.id = 1 if not await Product.find_all().to_list() else (await Product.find_all().to_list())[-1].id + 1
            await doc.insert()

    print("MongoDB seed completed.")


if __name__ == "__main__":
    asyncio.run(seed_mongodb())
