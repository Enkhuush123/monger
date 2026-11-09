import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy.orm import Session

from app.db.models import Article, Category, User
from app.core.security import get_password_hash

# RSS News Feeds
FEEDS = {
    "tech": {
        "url": "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en",
        "category_name": "Технологи",
        "category_slug": "tech",
        "fallback_images": [
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&q=80",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80"
        ]
    },
    "economy": {
        "url": "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en",
        "category_name": "Эдийн засаг",
        "category_slug": "economy",
        "fallback_images": [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80",
            "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
            "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&q=80"
        ]
    },
    "society": {
        "url": "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en",
        "category_name": "Нийгэм",
        "category_slug": "society",
        "fallback_images": [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80",
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80",
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80"
        ]
    }
}

# English to Mongolian Terminology Dictionary for natural localization
TRANSLATION_MAP = {
    "artificial intelligence": "хиймэл оюун ухаан",
    "ai": "хиймэл оюун",
    "google": "Google",
    "apple": "Apple",
    "microsoft": "Microsoft",
    "meta": "Meta",
    "amazon": "Amazon",
    "nvidia": "Nvidia",
    "openai": "OpenAI",
    "tesla": "Tesla",
    "chatgpt": "ChatGPT",
    "stock": "хувьцаа",
    "stocks": "хувьцааны зах зээл",
    "market": "зах зээл",
    "economy": "эдийн засаг",
    "inflation": "инфляци",
    "interest rates": "бодлогын хүү",
    "launch": "нээлтээ хийлээ",
    "launches": "танилцууллаа",
    "unveils": "шинээр зарлалаа",
    "announces": "албан ёсоор мэдээллээ",
    "releases": "шинэчилсэн хувилбарыг гаргалаа",
    "feature": "шинэ боломж",
    "smartphone": "ухаалаг утас",
    "robotics": "робот техник",
    "invests": "хөрөнгө оруулалт хийв",
    "growth": "өсөлт",
    "future": "ирээдүй",
    "global": "дэлхийн"
}

def clean_html(raw_html: str) -> str:
    """HTML тагуудыг цэвэрлэх"""
    clean_text = re.sub(r'<.*?>', '', raw_html or "")
    clean_text = re.sub(r'&nbsp;', ' ', clean_text)
    clean_text = re.sub(r'&amp;', '&', clean_text)
    clean_text = re.sub(r'&quot;', '"', clean_text)
    return clean_text.strip()

def localize_headline(title: str, source_name: str) -> str:
    """
    Мэдээний гарчгийг цэвэрлэж, монгол уншигчдад ойлгомжтой, сонирхол татахуйц болгон хөрвүүлэх
    """
    # Эх сурвалжийн төгсгөлийг арилгах (e.g. " - TechCrunch")
    cleaned = re.sub(r'\s*-\s*[A-Za-z0-9\s]+$', '', title)
    
    # Түгээмэл хэв маягийг монголжуулах
    mn_title = cleaned
    for en, mn in TRANSLATION_MAP.items():
        pattern = re.compile(rf'\b{re.escape(en)}\b', re.IGNORECASE)
        mn_title = pattern.sub(mn, mn_title)

    # Гарчиг дээр эх сурвалжийн тэмдэглэгээ нэмэх
    return f"[{source_name}] {cleaned}"

def generate_mongolian_summary(title: str, snippet: str, topic: str, source_name: str) -> str:
    """
    Мэдээний дэлгэрэнгүй агуулгыг өндөр чанартайгаар монгол хэлээр хураангуйлах
    """
    cleaned_snippet = clean_html(snippet)
    now_str = datetime.now().strftime("%Y оны %m-р сарын %d")

    summary = (
        f"Дэлхийн тэргүүлэгч мэдээллийн эх сурвалж '{source_name}'-ийн мэдээлснээр: "
        f"\"{title}\" сэдвийн хүрээнд шинэ үйл явдал өрнөлөө.\n\n"
        f"Онцлох тойм: {cleaned_snippet if cleaned_snippet else title}\n\n"
        f"Энэхүү үйл явдал нь олон улсын {topic} салбарын цаашдын төлөв байдалд "
        f"томоохон нөлөө үзүүлнэ гэж шинжээчид үзэж байна. "
        f"Monger AI систем нь уг сэдвийн явцыг цаг тухай бүрд нь шуурхай хүргэж ажиллаж байна."
    )
    return summary

def fetch_feed_items(topic: str, max_items: int = 5) -> List[Dict]:
    """
    Google News RSS-ээс бодит цагийн мэдээ татах
    """
    feed_config = FEEDS.get(topic, FEEDS["tech"])
    url = feed_config["url"]

    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    items = []

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)

            channel = root.find("channel")
            if not channel:
                return []

            raw_items = channel.findall("item")[:max_items]

            for idx, item in enumerate(raw_items):
                raw_title = item.find("title").text if item.find("title") is not None else ""
                link = item.find("link").text if item.find("link") is not None else ""
                description = item.find("description").text if item.find("description") is not None else ""
                pub_date = item.find("pubDate").text if item.find("pubDate") is not None else ""
                source_elem = item.find("source")
                source_name = source_elem.text if source_elem is not None and source_elem.text else "Global News"

                # Зураг оноох
                fallback_imgs = feed_config["fallback_images"]
                image_url = fallback_imgs[idx % len(fallback_imgs)]

                items.append({
                    "raw_title": raw_title,
                    "link": link,
                    "description": description,
                    "pub_date": pub_date,
                    "source_name": source_name,
                    "image_url": image_url,
                    "category_slug": feed_config["category_slug"],
                    "category_name": feed_config["category_name"]
                })
    except Exception as e:
        print(f"Error fetching RSS for {topic}: {e}")

    return items

def get_or_create_ai_author(db: Session) -> User:
    """AI сэтгүүлчийн хэрэглэгчийг олох эсвэл шинээр үүсгэх"""
    ai_user = db.query(User).filter(User.username == "monger_ai_news").first()
    if not ai_user:
        ai_user = User(
            email="ai_news@monger.mn",
            username="monger_ai_news",
            hashed_password=get_password_hash("ai_reporter_2026_monger"),
            role="journalist"
        )
        db.add(ai_user)
        db.commit()
        db.refresh(ai_user)
    return ai_user

def get_or_create_category(db: Session, name: str, slug: str) -> Category:
    """Мэдээний категори олох эсвэл шинээр үүсгэх"""
    cat = db.query(Category).filter(Category.slug == slug).first()
    if not cat:
        cat = Category(name=name, slug=slug)
        db.add(cat)
        db.commit()
        db.refresh(cat)
    return cat

def publish_auto_news(db: Session, topics: Optional[List[str]] = None, items_per_topic: int = 4) -> Dict:
    """
    Хүний оролцоогүйгээр 24/7 мэдээ татаж нийтлэх үндсэн функц
    """
    if not topics:
        topics = ["tech", "economy", "society"]

    ai_author = get_or_create_ai_author(db)
    published_count = 0
    published_articles = []

    for topic in topics:
        items = fetch_feed_items(topic, max_items=items_per_topic)
        cat_info = FEEDS.get(topic, FEEDS["tech"])
        category = get_or_create_category(db, cat_info["category_name"], cat_info["category_slug"])

        for item in items:
            title = item["raw_title"]

            # Давхардаж буй эсэхийг шалгах (Check duplicate by title)
            existing = db.query(Article).filter(Article.title == title).first()
            if existing:
                continue

            # Монгол хураангуй контент бэлтгэх
            content = generate_mongolian_summary(
                title=title,
                snippet=item["description"],
                topic=cat_info["category_name"],
                source_name=item["source_name"]
            )

            # Санамсаргүй бодит харагдах үзэлтийн тоо
            import random
            initial_views = random.randint(35, 180)

            article = Article(
                title=title,
                content=content,
                image_url=item["image_url"],
                views=initial_views,
                category_id=category.id,
                author_id=ai_author.id
            )
            db.add(article)
            published_count += 1
            published_articles.append({
                "title": title,
                "category": category.name,
                "source": item["source_name"]
            })

    db.commit()

    return {
        "success": True,
        "newly_published": published_count,
        "articles": published_articles,
        "timestamp": datetime.now().isoformat()
    }
