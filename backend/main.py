from app import create_app
from database import models, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)