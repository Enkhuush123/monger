from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    articles = relationship("Article", back_populates="author")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)

    articles = relationship("Article", back_populates="category")


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    views = Column(Integer, default=0)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    author_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="articles")
    author = relationship("User", back_populates="articles")


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User")
    posts = relationship("BlogPost", back_populates="blog")


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    views = Column(Integer, default=0)
    
    blog_id = Column(Integer, ForeignKey("blogs.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    blog = relationship("Blog", back_populates="posts")


class SearchTrend(Base):
    __tablename__ = "search_trends"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, unique=True, index=True, nullable=False)
    search_count = Column(Integer, default=1)
    last_searched_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AdCampaign(Base):
    __tablename__ = "ad_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    target_url = Column(String, nullable=False)
    ad_type = Column(String, default="home_banner", index=True) # "home_banner", "search_top", "sidebar"
    target_keyword = Column(String, nullable=True, index=True)
    price_paid = Column(Integer, default=0) # MNT
    days = Column(Integer, default=1)
    status = Column(String, default="active", index=True) # "active", "pending", "expired"
    clicks = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    contact_phone = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # Монгол нэр
    name_en = Column(String, index=True, nullable=True) # English name for tourists
    category = Column(String, index=True, nullable=False) # restaurant, cafe, hotel, attraction, nightlife
    description = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    working_hours = Column(String, nullable=True) # "09:00 - 22:00"
    image_url = Column(String, nullable=True)
    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False) # SmartPlace verified badge
    is_featured = Column(Boolean, default=False) # Sponsored / Top recommendation
    price_level = Column(String, default="₮₮") # ₮, ₮₮, ₮₮₮
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reviews = relationship("PlaceReview", back_populates="place", cascade="all, delete-orphan")
    owner = relationship("User")


class PlaceReview(Base):
    __tablename__ = "place_reviews"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author_name = Column(String, nullable=False)
    rating = Column(Integer, nullable=False) # 1 to 5
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    place = relationship("Place", back_populates="reviews")
    user = relationship("User")

