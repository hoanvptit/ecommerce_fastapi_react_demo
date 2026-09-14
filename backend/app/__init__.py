from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import categories, products, users
from database.database import init_db


def create_app() -> FastAPI:
    app = FastAPI(
        title="E-Commerce API",
        description="API for managing products and categories",
        version="1.0.0",
    )

    @app.on_event("startup")
    async def startup_event() -> None:
        await init_db()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(categories.router, prefix="/categories", tags=["categories"])
    app.include_router(products.router, prefix="/products", tags=["products"])
    app.include_router(users.router, prefix="/users", tags=["users"])
    
    @app.get("/health")
    async def health_check():
        return {"status": "ok"}

    return app
