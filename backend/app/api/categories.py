from fastapi import APIRouter, HTTPException
from typing import List

from ..schemas.category import Category, CategoryCreate
from database.models import Category as CategoryModel, get_next_sequence

router = APIRouter()


@router.get("/", response_model=List[Category])
async def read_categories(skip: int = 0, limit: int = 100):
    categories = await CategoryModel.find_all().skip(skip).limit(limit).to_list()
    return categories


@router.get("/{category_id}", response_model=Category)
async def read_category(category_id: int):
    category = await CategoryModel.find_one(CategoryModel.id == category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate):
    db_category = CategoryModel(name=category.name)
    db_category.id = await get_next_sequence("categories")
    await db_category.insert()
    return db_category
