# FastAPI E-Commerce API Implementation Plan

## 1. Project Structure
```
demo_fastapi_app/
├── database/
│   ├── database.py      # Database connection and session management
│   ├── models.py        # SQLAlchemy models
│   └── schema.sql       # SQL schema (already implemented)
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── categories.py  # Category routes
│   │   └── products.py    # Product routes
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── category.py    # Pydantic models for category
│   │   └── product.py     # Pydantic models for product
│   └── __init__.py
├── main.py              # FastAPI application entry point
└── requirements.txt     # Project dependencies
```

## 2. Implementation Steps

### 2.1 Database Setup (Already Implemented)
- ✅ SQL schema is already defined with proper relationships
- ✅ Database connection setup is in place

### 2.2 Create SQLAlchemy Models
- Implement Category model with:
  - id: Integer, primary key
  - name: String
  - products: Relationship to Product
- Implement Product model with:
  - id: Integer, primary key
  - name: String
  - price: Decimal
  - category_id: Foreign key to Category
  - category: Relationship to Category

### 2.3 Create Pydantic Schemas
- CategoryBase schema:
  - name: str
- CategoryCreate schema (inherits from CategoryBase)
- Category schema (inherits from CategoryBase):
  - id: int
  - products: list[Product] (optional)

- ProductBase schema:
  - name: str
  - price: float
  - category_id: int
- ProductCreate schema (inherits from ProductBase)
- Product schema (inherits from ProductBase):
  - id: int
  - category: Category (optional)

### 2.4 Implement API Routes

#### Categories API
- GET /categories/
  - List all categories
  - Optional query parameters: skip, limit
  - Response: List[Category]

- GET /categories/{category_id}
  - Get single category by ID
  - Response: Category with products

- POST /categories/
  - Create new category
  - Request body: CategoryCreate
  - Response: Category

#### Products API
- GET /products/
  - List all products
  - Optional query parameters: skip, limit, category_id
  - Response: List[Product]

- GET /products/{product_id}
  - Get single product by ID
  - Response: Product with category

- POST /products/
  - Create new product
  - Request body: ProductCreate
  - Response: Product

### 2.5 Error Handling
- Implement proper error handling for:
  - Not found (404)
  - Validation errors (422)
  - Database integrity errors (400)
  - Internal server errors (500)

### 2.6 Documentation
- Implement OpenAPI documentation with:
  - Proper descriptions for each endpoint
  - Example requests and responses
  - Authentication requirements (if needed)

## 3. Testing Plan
1. Unit tests for:
   - Pydantic models validation
   - Database models
   - API endpoints

2. Integration tests for:
   - Database operations
   - API endpoints with database interaction

## 4. Dependencies Required
```
fastapi>=0.68.0
uvicorn>=0.15.0
sqlalchemy>=1.4.23
pydantic>=1.8.2
alembic>=1.7.1
pytest>=6.2.5 (for testing)
```

## 5. Future Enhancements
1. Implement pagination for list endpoints
2. Add filtering and sorting options
3. Implement caching for frequently accessed data
4. Add rate limiting
5. Implement authentication and authorization