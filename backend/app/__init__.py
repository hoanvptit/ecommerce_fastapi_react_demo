from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import categories, products

def create_app() -> FastAPI:
    app = FastAPI(title="E-Commerce API",
                 description="API for managing products and categories",
                 version="1.0.0")
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],  # Vite default port
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(categories.router, prefix="/categories", tags=["categories"])
    app.include_router(products.router, prefix="/products", tags=["products"])
    
    return app