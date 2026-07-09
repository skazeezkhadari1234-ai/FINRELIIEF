from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Import routers
from app.routers.auth import router as auth_router
from app.routers.loans import router as loan_router
from app.routers.dashboard import router as dashboard_router
from app.routers.settlement import router as settlement_router
from app.routers.ai import router as ai_router
from app.routers.history import router as history_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FinRelief AI",
    description="AI-Powered Debt Relief & Financial Recovery Platform",
    version="1.0.0"
)

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://finrelief-1.onrender.com"   # Replace with your actual frontend URL after deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routers
app.include_router(auth_router, tags=["Authentication"])
app.include_router(loan_router, tags=["Loans"])
app.include_router(dashboard_router, tags=["Dashboard"])
app.include_router(settlement_router, tags=["Settlement"])
app.include_router(ai_router, tags=["AI"])
app.include_router(history_router, tags=["History"])


@app.get("/")
def root():
    return {
        "application": "FinRelief AI",
        "version": "1.0.0",
        "status": "Running",
        "message": "Welcome to FinRelief AI API 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
        "api": "running"
    }


@app.get("/test-db")
def test_database():
    try:
        Base.metadata.create_all(bind=engine)
        return {
            "success": True,
            "message": "Database connected successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }