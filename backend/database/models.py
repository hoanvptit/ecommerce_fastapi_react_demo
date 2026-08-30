from typing import Optional

from beanie import Document
from pydantic import ConfigDict, Field


class Counter(Document):
    name: str
    value: int = 1

    class Settings:
        name = "counters"


async def get_next_sequence(name: str) -> int:
    counter = await Counter.find_one(Counter.name == name)
    if counter is None:
        counter = Counter(name=name, value=1)
        await counter.insert()
        return counter.value

    counter.value += 1
    await counter.save()
    return counter.value


class Category(Document):
    id: Optional[int] = Field(default=None, alias="_id")
    name: str

    class Settings:
        name = "categories"

    model_config = ConfigDict(populate_by_name=True)


class Product(Document):
    id: Optional[int] = Field(default=None, alias="_id")
    name: str
    price: float
    category_id: int

    class Settings:
        name = "products"

    model_config = ConfigDict(populate_by_name=True)


class Customer(Document):
    id: Optional[int] = Field(default=None, alias="_id")
    name: str
    address: str
    phone_number: str

    class Settings:
        name = "customers"

    model_config = ConfigDict(populate_by_name=True)


class Cart(Document):
    id: Optional[int] = Field(default=None, alias="_id")
    customer_id: int
    product_id: int

    class Settings:
        name = "cart"

    model_config = ConfigDict(populate_by_name=True)


class User(Document):
    id: Optional[int] = Field(default=None, alias="_id")
    username: str
    email: str
    hashed_password: str
    role: str = "user"

    class Settings:
        name = "users"

    model_config = ConfigDict(populate_by_name=True)
