from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.db.database import get_db
from app.db.models import Place, PlaceReview
from app.schemas.schemas import PlaceCreate, PlaceResponse, PlaceReviewCreate, PlaceReviewResponse

router = APIRouter()

@router.get("", response_model=List[PlaceResponse])
@router.get("/", response_model=List[PlaceResponse])
def get_places(
    category: Optional[str] = None,
    q: Optional[str] = None,
    featured_only: bool = False,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Газруудын жагсаалт (Ангилал, хайлт, онцолсоноор шүүх)
    """
    query = db.query(Place)

    if category and category != "all":
        query = query.filter(Place.category == category)

    if q:
        search_filter = or_(
            Place.name.ilike(f"%{q}%"),
            Place.name_en.ilike(f"%{q}%"),
            Place.description.ilike(f"%{q}%"),
            Place.address.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    if featured_only:
        query = query.filter(Place.is_featured == True)

    places = query.order_by(
        Place.is_featured.desc(),
        Place.rating.desc(),
        Place.review_count.desc()
    ).offset(skip).limit(limit).all()

    return places


@router.get("/{place_id}", response_model=PlaceResponse)
def get_place_detail(place_id: int, db: Session = Depends(get_db)):
    """
    Нэг газрын дэлгэрэнгүй мэдээлэл & сэтгэгдлүүд
    """
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Газар олдсонгүй")
    return place


@router.post("", response_model=PlaceResponse)
@router.post("/", response_model=PlaceResponse)
def create_place(place_in: PlaceCreate, db: Session = Depends(get_db)):
    """
    Шинэ газар / бизнес бүртгүүлэх (SmartPlace)
    """
    db_place = Place(
        name=place_in.name,
        name_en=place_in.name_en,
        category=place_in.category,
        description=place_in.description,
        description_en=place_in.description_en,
        address=place_in.address,
        phone=place_in.phone,
        working_hours=place_in.working_hours,
        image_url=place_in.image_url,
        price_level=place_in.price_level,
        rating=5.0,
        review_count=0,
        is_verified=False,
        is_featured=False
    )
    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place


@router.post("/{place_id}/reviews", response_model=PlaceReviewResponse)
def add_place_review(place_id: int, review_in: PlaceReviewCreate, db: Session = Depends(get_db)):
    """
    Газарт үнэлгээ (1-5 од) & сэтгэгдэл үлдээх
    """
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Газар олдсонгүй")

    rating_val = max(1, min(5, review_in.rating))

    db_review = PlaceReview(
        place_id=place.id,
        author_name=review_in.author_name or "Зочин",
        rating=rating_val,
        comment=review_in.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    # Газрын дундаж үнэлгээ болон сэтгэгдлийн тоог шинэчлэх
    all_ratings = db.query(PlaceReview.rating).filter(PlaceReview.place_id == place_id).all()
    if all_ratings:
        total = sum(r[0] for r in all_ratings)
        place.review_count = len(all_ratings)
        place.rating = round(total / len(all_ratings), 1)
        db.commit()

    return db_review


@router.post("/{place_id}/claim")
def claim_place_smartplace(place_id: int, db: Session = Depends(get_db)):
    """
    SmartPlace: Байгууллагын баталгаажсан хөх тэмдэг олгох
    """
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(status_code=404, detail="Газар олдсонгүй")

    place.is_verified = True
    db.commit()
    return {"success": True, "message": "Байгууллагын профайл амжилттай баталгаажлаа!"}
