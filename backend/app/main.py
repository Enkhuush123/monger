import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import auth, users, categories, articles, blogs, ads, places, upload
from app.core.config import settings
from app.db.database import SessionLocal
from app.services.ai_news_bot import publish_auto_news

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Monger (Mongolian Naver)",
    version="0.1.0",
)

# Static files for direct user uploads
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(articles.router, prefix="/api/v1/articles", tags=["Articles"])
app.include_router(blogs.router, prefix="/api/v1/blogs", tags=["Blogs"])
app.include_router(ads.router, prefix="/api/v1/ads", tags=["Ads & Monetization"])
app.include_router(places.router, prefix="/api/v1/places", tags=["Places & Reviews"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["File Upload"])

@app.on_event("startup")
def startup_event():
    """
    Сервер асах үед AI автомат бот ажиллуулж мэдээг дүүргэх
    """
    db = SessionLocal()
    try:
        from app.db.models import Article
        article_count = db.query(Article).count()
        if article_count < 8:
            print("Running initial AI Auto-News publisher...")
            publish_auto_news(db, items_per_topic=3)
            print("AI Auto-News populated!")
    except Exception as e:
        print("Startup AI news publisher notice:", e)
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Monger API. Visit /docs for Swagger UI."}
