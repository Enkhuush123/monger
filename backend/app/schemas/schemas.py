from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    username: str

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

# Properties to return via API
class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    role: Optional[str] = None

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# Article Schemas
class ArticleBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    category_id: int

class ArticleCreate(ArticleBase):
    pass

class ArticleResponse(ArticleBase):
    id: int
    views: int
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse
    author: UserResponse

    class Config:
        from_attributes = True

# Blog Schemas
class BlogBase(BaseModel):
    title: str
    description: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogResponse(BlogBase):
    id: int
    user_id: int
    created_at: datetime
    owner: UserResponse

    class Config:
        from_attributes = True

# BlogPost Schemas
class BlogPostBase(BaseModel):
    title: str
    content: str

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: int
    views: int
    blog_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# SearchTrend Schema
class SearchTrendResponse(BaseModel):
    id: int
    keyword: str
    search_count: int

    class Config:
        from_attributes = True


# AdCampaign Schemas
class AdCampaignBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    target_url: str
    ad_type: str = "home_banner"
    target_keyword: Optional[str] = None
    days: int = 1
    contact_phone: Optional[str] = None

class AdCampaignCreate(AdCampaignBase):
    pass

class AdCampaignResponse(AdCampaignBase):
    id: int
    price_paid: int
    status: str
    clicks: int
    impressions: int
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Place & Review Schemas (Monger Place)
class PlaceReviewBase(BaseModel):
    rating: int
    comment: str
    author_name: str

class PlaceReviewCreate(PlaceReviewBase):
    pass

class PlaceReviewResponse(PlaceReviewBase):
    id: int
    place_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PlaceBase(BaseModel):
    name: str
    name_en: Optional[str] = None
    category: str
    description: Optional[str] = None
    description_en: Optional[str] = None
    address: str
    phone: Optional[str] = None
    working_hours: Optional[str] = "10:00 - 22:00"
    image_url: Optional[str] = None
    price_level: Optional[str] = "₮₮"

class PlaceCreate(PlaceBase):
    pass

class PlaceResponse(PlaceBase):
    id: int
    rating: float
    review_count: int
    is_verified: bool
    is_featured: bool
    created_at: datetime
    reviews: Optional[list[PlaceReviewResponse]] = []

    class Config:
        from_attributes = True
