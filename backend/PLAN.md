# FastAPI E-Commerce API Implementation Plan

## 1. Project Structure
```text
demo_fastapi_app/
+-- database/
¦   +-- database.py     # MongoDB connection and Beanie initialization
¦   +-- models.py       # Beanie document models
¦   +-- schema.sql      # Legacy schema file retained for reference only
+-- app/
¦   +-- api/
¦   ¦   +-- __init__.py
¦   ¦   +-- categories.py  # Category routes
¦   ¦   +-- products.py    # Product routes
¦   ¦   +-- users.py       # User auth routes
¦   +-- schemas/
¦   ¦   +-- __init__.py
¦   ¦   +-- category.py    # Pydantic category models
¦   ¦   +-- product.py     # Pydantic product models
¦   ¦   +-- user.py        # Pydantic auth models
¦   +-- __init__.py
+-- main.py              # FastAPI app entry point
+-- requirements.txt     # Project dependencies
+-- migrate_to_mysql.py  # Legacy migration script replaced by MongoDB seed setup
```

## 2. Current Architecture
- FastAPI backend exposes REST APIs for categories, products, and users
- Beanie + Motor connect to MongoDB instead of SQLAlchemy + MySQL
- Each document stores its own numeric `id` field to preserve the existing API shape
- MongoDB connection string is configured via `MONGODB_URL` environment variable

## 3. Data Model
- `Category`: `{ _id: int, name: string }`
- `Product`: `{ _id: int, name: string, price: float, category_id: int }`
- `User`: `{ _id: int, username: string, email: string, hashed_password: string, role: string }`

## 4. Runtime Setup
```bash
cd backend
pip install -r requirements.txt
set MONGODB_URL=mongodb://localhost:27017/ecommerce
python main.py
```

## 5. Notes
- The project is intentionally moving away from SQLAlchemy/MySQL toward MongoDB + Beanie.
- The app expects a local MongoDB instance running on the default port unless `MONGODB_URL` is set.
