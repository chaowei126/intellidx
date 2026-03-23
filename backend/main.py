from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.database import engine, Base
import os

# Import models to ensure they are registered with SQLAlchemy
from models.user import User
from models.report import Report, Citation

# Create tables (for MVP; normally you'd use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="IntelliDX API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:80",
        "http://127.0.0.1:80",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api import auth, reports

app.include_router(auth.router)
app.include_router(reports.router)

os.makedirs("/app/outputs", exist_ok=True)
app.mount("/download", StaticFiles(directory="/app/outputs"), name="outputs")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
