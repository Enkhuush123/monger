from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Article, User
from app.schemas.schemas import ArticleResponse, ArticleCreate
from app.api.v1.users import get_current_user

router = APIRouter()

from app.services.ai_news_bot import publish_auto_news

@router.get("/", response_model=List[ArticleResponse])
def get_articles(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """
    Бүх мэдээг хамгийн шинээс нь хуудаслаж татах
    """
    articles = db.query(Article).order_by(Article.created_at.desc()).offset(skip).limit(limit).all()
    return articles

@router.post("/ai-auto-publish")
def trigger_ai_news_publisher(
    count_per_topic: int = 3,
    db: Session = Depends(get_db)
):
    """
    🤖 AI Автомат Сэтгүүлч: 24/7 дэлхийн болон технологийн шинэ мэдээ татаж нийтлэх
    """
    result = publish_auto_news(db, items_per_topic=count_per_topic)
    return result

@router.post("/", response_model=ArticleResponse)
def create_article(
    article: ArticleCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Шинэ мэдээ оруулах (Зөвхөн сэтгүүлч эсвэл админ)
    """
    if current_user.role not in ["journalist", "admin"]:
        raise HTTPException(
            status_code=403, 
            detail="Та мэдээ оруулах эрхгүй байна. Зөвхөн сэтгүүлч эсвэл админ мэдээ оруулах боломжтой."
        )
    db_article = Article(
        title=article.title,
        content=article.content,
        image_url=article.image_url,
        category_id=article.category_id,
        author_id=current_user.id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

from app.db.models import Article, User, SearchTrend

@router.get("/search", response_model=List[ArticleResponse])
def search_articles(q: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    Мэдээ хайх болон Тренд тоолох
    """
    if q.strip():
        # Record the search trend
        keyword = q.strip().lower()
        trend = db.query(SearchTrend).filter(SearchTrend.keyword == keyword).first()
        if trend:
            trend.search_count += 1
        else:
            trend = SearchTrend(keyword=keyword, search_count=1)
            db.add(trend)
        db.commit()

    search_term = f"%{q}%"
    articles = db.query(Article).filter(
        (Article.title.ilike(search_term)) | (Article.content.ilike(search_term))
    ).offset(skip).limit(limit).all()
    return articles

@router.get("/trending")
def get_trending_searches(db: Session = Depends(get_db)):
    """
    Тренд хайлтуудыг буцаах
    """
    trends = db.query(SearchTrend).order_by(SearchTrend.search_count.desc()).limit(10).all()
    return trends

@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """
    Нэг мэдээг дэлгэрэнгүй унших
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Мэдээ олдсонгүй")
    
    # Хандалтын тоог (views) 1-ээр нэмэгдүүлэх
    article.views += 1
    db.commit()
    db.refresh(article)
    
    return article
