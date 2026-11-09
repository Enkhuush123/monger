from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Blog, BlogPost, User
from app.schemas.schemas import BlogResponse, BlogCreate, BlogPostResponse, BlogPostCreate
from app.api.v1.users import get_current_user

router = APIRouter()

@router.post("/", response_model=BlogResponse)
def create_blog(
    blog: BlogCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Хэрэглэгч блогтой эсэхийг шалгах
    existing_blog = db.query(Blog).filter(Blog.user_id == current_user.id).first()
    if existing_blog:
        raise HTTPException(status_code=400, detail="Та аль хэдийн блог нээсэн байна.")
        
    db_blog = Blog(
        title=blog.title,
        description=blog.description,
        user_id=current_user.id
    )
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.get("/{username}", response_model=BlogResponse)
def get_blog_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")
        
    blog = db.query(Blog).filter(Blog.user_id == user.id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Блог олдсонгүй")
    return blog

@router.get("/all/posts")
def get_all_blog_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    Нүүр хуудсанд зориулж бүх блог нийтлэлүүдийг (эзэмшигчийн мэдээлэлтэй) авах
    """
    posts = db.query(BlogPost, Blog, User)\
        .join(Blog, BlogPost.blog_id == Blog.id)\
        .join(User, Blog.user_id == User.id)\
        .order_by(BlogPost.created_at.desc())\
        .offset(skip).limit(limit).all()
        
    result = []
    for post, blog, user in posts:
        result.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "views": post.views,
            "created_at": post.created_at,
            "blog_title": blog.title,
            "username": user.username
        })
    return result

@router.post("/posts/", response_model=BlogPostResponse)
def create_blog_post(
    post: BlogPostCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    blog = db.query(Blog).filter(Blog.user_id == current_user.id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Та эхлээд блог нээх шаардлагатай.")
        
    db_post = BlogPost(
        title=post.title,
        content=post.content,
        blog_id=blog.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/{username}/posts", response_model=List[BlogPostResponse])
def get_blog_posts(username: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Хэрэглэгч олдсонгүй")
        
    blog = db.query(Blog).filter(Blog.user_id == user.id).first()
    if not blog:
        return []
        
    posts = db.query(BlogPost).filter(BlogPost.blog_id == blog.id).order_by(BlogPost.created_at.desc()).offset(skip).limit(limit).all()
    return posts
