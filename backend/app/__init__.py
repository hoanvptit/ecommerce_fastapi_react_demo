from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import categories, products, users

def create_app() -> FastAPI:
    app = FastAPI(
        title="E-Commerce API",
        description="API for managing products and categories",
        version="1.0.0"
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",  # Vite default port
            "http://127.0.0.1:5173",
            "http://localhost:3000",   # In case you use React's default port
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(categories.router, prefix="/categories", tags=["categories"])
    app.include_router(products.router, prefix="/products", tags=["products"])
    app.include_router(users.router, prefix="/users", tags=["users"])
    
    return app