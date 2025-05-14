from app import create_app
from database import models, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )