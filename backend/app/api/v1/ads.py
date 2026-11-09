from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.db.models import AdCampaign, User
from app.schemas.schemas import AdCampaignCreate, AdCampaignResponse

router = APIRouter()

# Үнийн тариф (Өдрийн төлбөр MNT-ээр)
DAILY_RATES = {
    "home_banner": 15000,
    "search_top": 10000,
    "sidebar": 7000
}

@router.post("/create")
def create_ad_campaign(ad_in: AdCampaignCreate, db: Session = Depends(get_db)):
    """
    Зар сурталчилгаа үүсгэж, QPay нэхэмжлэх бэлтгэх
    """
    rate = DAILY_RATES.get(ad_in.ad_type, 10000)
    total_price = rate * max(1, ad_in.days)
    
    expires = datetime.utcnow() + timedelta(days=ad_in.days)

    db_ad = AdCampaign(
        title=ad_in.title,
        description=ad_in.description,
        image_url=ad_in.image_url,
        target_url=ad_in.target_url,
        ad_type=ad_in.ad_type,
        target_keyword=ad_in.target_keyword.lower() if ad_in.target_keyword else None,
        price_paid=total_price,
        days=ad_in.days,
        contact_phone=ad_in.contact_phone,
        status="pending",
        expires_at=expires
    )
    db.add(db_ad)
    db.commit()
    db.refresh(db_ad)

    # QPay төлбөрийн нэхэмжлэх үүсгэх загварчлал
    invoice_data = {
        "invoice_id": f"QINV-{db_ad.id}-{int(datetime.utcnow().timestamp())}",
        "ad_id": db_ad.id,
        "amount": total_price,
        "description": f"Monger {ad_in.ad_type} зар - {ad_in.days} хоног",
        "qr_text": f"qpay://payment?invoice=INV{db_ad.id}&amount={total_price}",
        "banks": [
            {"name": "Хаан банк", "code": "khan", "logo": "🏦"},
            {"name": "Голомт банк", "code": "golomt", "logo": "💳"},
            {"name": "Хас банк", "code": "xac", "logo": "🌟"},
            {"name": "Төрийн банк", "code": "state", "logo": "🏛️"},
            {"name": "SocialPay", "code": "socialpay", "logo": "📱"}
        ]
    }

    return {
        "ad": {
            "id": db_ad.id,
            "title": db_ad.title,
            "price_paid": db_ad.price_paid,
            "status": db_ad.status,
            "ad_type": db_ad.ad_type,
            "days": db_ad.days
        },
        "invoice": invoice_data
    }


@router.post("/{ad_id}/pay-confirm")
def confirm_ad_payment(ad_id: int, db: Session = Depends(get_db)):
    """
    QPay төлбөр шалгаж, зарыг ИДЭВХЖҮҮЛЭХ
    """
    ad = db.query(AdCampaign).filter(AdCampaign.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Зар олдсонгүй")

    ad.status = "active"
    ad.expires_at = datetime.utcnow() + timedelta(days=ad.days)
    db.commit()
    db.refresh(ad)

    return {
        "success": True,
        "message": "Төлбөр амжилттай баталгаажлаа! Таны зар идэвхжлээ.",
        "ad_id": ad.id,
        "status": ad.status,
        "expires_at": ad.expires_at
    }


@router.get("/active", response_model=List[AdCampaignResponse])
def get_active_ads(
    ad_type: Optional[str] = None, 
    keyword: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    """
    Одоо идэвхтэй байгаа заруудыг авах (Хайлт болон нүүр хуудсанд харуулахад)
    """
    query = db.query(AdCampaign).filter(
        AdCampaign.status == "active",
        AdCampaign.expires_at >= datetime.utcnow()
    )

    if ad_type:
        query = query.filter(AdCampaign.ad_type == ad_type)

    if keyword:
        query = query.filter(
            (AdCampaign.target_keyword == keyword.lower()) | 
            (AdCampaign.title.ilike(f"%{keyword}%"))
        )

    ads = query.order_by(func.random()).limit(5).all()

    # Үзэлтийг (impression) тоолох
    for ad in ads:
        ad.impressions = (ad.impressions or 0) + 1
    db.commit()

    return ads


@router.post("/{ad_id}/click")
def track_ad_click(ad_id: int, db: Session = Depends(get_db)):
    """
    Зарын даралтыг (click) тоолох
    """
    ad = db.query(AdCampaign).filter(AdCampaign.id == ad_id).first()
    if ad:
        ad.clicks = (ad.clicks or 0) + 1
        db.commit()
        return {"success": True, "clicks": ad.clicks}
    raise HTTPException(status_code=404, detail="Зар олдсонгүй")


@router.get("/admin/stats")
def get_ads_admin_stats(db: Session = Depends(get_db)):
    """
    Фоундерын Хяналтын Самбар: Нийт орлого, Идэвхтэй зарын тоо, Статистик
    """
    total_revenue = db.query(func.sum(AdCampaign.price_paid)).filter(AdCampaign.status == "active").scalar() or 0
    active_count = db.query(AdCampaign).filter(AdCampaign.status == "active", AdCampaign.expires_at >= datetime.utcnow()).count()
    total_clicks = db.query(func.sum(AdCampaign.clicks)).scalar() or 0
    total_impressions = db.query(func.sum(AdCampaign.impressions)).scalar() or 0

    recent_ads = db.query(AdCampaign).order_by(AdCampaign.created_at.desc()).limit(10).all()

    return {
        "total_revenue_mnt": total_revenue,
        "active_ads_count": active_count,
        "total_clicks": total_clicks,
        "total_impressions": total_impressions,
        "recent_ads": [
            {
                "id": a.id,
                "title": a.title,
                "price_paid": a.price_paid,
                "days": a.days,
                "status": a.status,
                "ad_type": a.ad_type,
                "contact_phone": a.contact_phone,
                "clicks": a.clicks,
                "impressions": a.impressions,
                "created_at": a.created_at
            }
            for a in recent_ads
        ]
    }
