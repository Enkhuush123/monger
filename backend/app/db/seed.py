from app.db.database import SessionLocal
from app.db.models import User, Category, Article, Blog, BlogPost, SearchTrend, AdCampaign
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Already seeded!")
            return

        print("Seeding users...")
        admin = User(
            email="admin@monger.mn",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        journalist = User(
            email="news@monger.mn",
            username="monger_reporter",
            hashed_password=get_password_hash("news123"),
            role="journalist"
        )
        creator = User(
            email="bat@monger.mn",
            username="bat_tech",
            hashed_password=get_password_hash("bat123"),
            role="user"
        )
        db.add_all([admin, journalist, creator])
        db.commit()
        db.refresh(admin)
        db.refresh(journalist)
        db.refresh(creator)

        print("Seeding categories...")
        tech = Category(name="Технологи", slug="tech")
        economy = Category(name="Эдийн засаг", slug="economy")
        society = Category(name="Нийгэм", slug="society")
        db.add_all([tech, economy, society])
        db.commit()
        db.refresh(tech)
        db.refresh(economy)
        db.refresh(society)

        print("Seeding articles...")
        a1 = Article(
            title="Монгол залуус хиймэл оюун ухаанд суурилсан шинэ хайлтын систем бүтээлээ",
            content="Мэдээллийн эрин зуунд Монгол хэл дээрх мэдээлэл, нийтлэлүүдийг нэгтгэн хамгийн хурдан шуурхай хайх 'Monger' платформ туршилтын хувилбараа олон нийтэд танилцууллаа.",
            category_id=tech.id,
            author_id=journalist.id,
            views=1420
        )
        a2 = Article(
            title="Монголбанкны бодлогын хүү болон эдийн засгийн төлөв байдал",
            content="Инфляцийн түвшин тогтворжиж, гадаад худалдааны тэнцэл ашигтай гарснаар төгрөгийн ханш чангарах хандлагатай байна гэж эдийн засагчид дүгнэв.",
            category_id=economy.id,
            author_id=journalist.id,
            views=890
        )
        db.add_all([a1, a2])

        print("Seeding blog and posts...")
        blog = Blog(
            title="Батын Технологи ба Стартап Тэмдэглэл",
            description="AI, Програмчлал, Монголын шинэ бизнесүүдийн туршлага",
            user_id=creator.id
        )
        db.add(blog)
        db.commit()
        db.refresh(blog)

        p1 = BlogPost(
            title="Яагаад Монголд Naver шиг портал систем дутагдаж байгаа вэ?",
            content="Фэйсбүүк группүүдээс хуучин нийтлэл хайж олоход туйлын хүндрэлтэй. Бидэнд бие даасан, блогчид нь өөрсдөө орлого олдог нэгдсэн систем хэрэгтэй байсан юм...",
            blog_id=blog.id,
            views=530
        )
        db.add(p1)

        print("Seeding search trends...")
        trends = [
            SearchTrend(keyword="Хиймэл оюун", search_count=128),
            SearchTrend(keyword="Цаг агаар", search_count=95),
            SearchTrend(keyword="Валютын ханш", search_count=82),
            SearchTrend(keyword="Стартап хөрөнгө оруулалт", search_count=64),
            SearchTrend(keyword="Monger блогийн систем", search_count=51)
        ]
        db.add_all(trends)

        print("Seeding active ads...")
        ad1 = AdCampaign(
            title="🚀 TomYo EdTech: Дэлхийн шилдэг боловсролыг Монголоос",
            description="Герман, Америк, Японы тэтгэлэгт хамрагдах албан ёсны зааварчилгааг аваарай.",
            image_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
            target_url="https://tomyo.mn",
            ad_type="home_banner",
            price_paid=45000,
            days=3,
            status="active",
            clicks=24,
            impressions=380,
            expires_at=datetime.utcnow() + timedelta(days=3)
        )
        db.add(ad1)

        db.commit()
        print("Database successfully seeded with demo data!")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
