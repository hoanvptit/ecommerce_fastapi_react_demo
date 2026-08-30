from typing import List

from fastapi import APIRouter, HTTPException

from ..schemas.product import Product, ProductCreate
from database.models import Product as ProductModel, get_next_sequence

router = APIRouter()


@router.get("/", response_model=List[Product])
async def read_products(skip: int = 0, limit: int = 100, category_id: int | None = None):
    query = ProductModel.find_all()
    if category_id is not None:
        query = ProductModel.find(ProductModel.category_id == category_id)

    products = await query.skip(skip).limit(limit).to_list()
    return products


@router.get("/{product_id}", response_model=Product)
async def read_product(product_id: int):
    product = await ProductModel.find_one(ProductModel.id == product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=Product)
async def create_product(product: ProductCreate):
    db_product = ProductModel(
        name=product.name,
        price=product.price,
        category_id=product.category_id,
    )
    db_product.id = await get_next_sequence("products")
    await db_product.insert()
    return db_product
