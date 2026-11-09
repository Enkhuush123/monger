from app.db.database import SessionLocal
from app.db.models import Place, PlaceReview

def seed_places():
    db = SessionLocal()
    try:
        all_places_data = [
            {
                "name": "Чингис Хаан Үндэсний Музей",
                "name_en": "Chinggis Khaan National Museum",
                "category": "attraction",
                "description": "Монголын төрт ёсны 2000 гаруй жилийн түүхийг харуулсан Азийн тэргүүлэгч орчин үеийн музей.",
                "description_en": "A state-of-the-art modern museum displaying over 2,000 years of nomadic statehood and royal imperial heritage.",
                "address": "Сүхбаатар дүүрэг, Их сургуулийн гудамж",
                "phone": "7011-0099",
                "working_hours": "09:00 - 18:00 (Мягмар гарагт амарна)",
                "image_url": "https://images.unsplash.com/photo-1599818816949-923c8a980590?w=800&q=80",
                "rating": 4.9,
                "review_count": 3,
                "is_verified": True,
                "is_featured": True,
                "price_level": "₮₮"
            },
            {
                "name": "ROC Caffeine Bar",
                "name_en": "ROC Caffeine Bar",
                "category": "cafe",
                "description": "Улаанбаатарын тусгай кофены соёлыг түгээгч, шилдэг бариста нарын бүтээл, тохилог орчин.",
                "description_en": "Premier specialty coffee shop in Ulaanbaatar, renowned for artisan espresso roasts and cozy work-friendly atmosphere.",
                "address": "Сүхбаатар дүүрэг, Сөүлийн гудамж",
                "phone": "7711-2233",
                "working_hours": "08:00 - 22:00",
                "image_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
                "rating": 4.8,
                "review_count": 2,
                "is_verified": True,
                "is_featured": True,
                "price_level": "₮₮"
            },
            {
                "name": "Modern Nomads Ресторан",
                "name_en": "Modern Nomads Restaurant",
                "category": "restaurant",
                "description": "Уламжлалт монгол хоолыг европ соёлтой хослуулсан, гадаад дотоодын зочдын дуртай газар.",
                "description_en": "Famous traditional Mongolian restaurant offering modern fusion nomadic cuisine, buuz, and steppe delicacies.",
                "address": "Чингэлтэй дүүрэг, Бага тойруу",
                "phone": "11-318744",
                "working_hours": "10:00 - 23:00",
                "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                "rating": 4.7,
                "review_count": 2,
                "is_verified": True,
                "is_featured": False,
                "price_level": "₮₮"
            },
            {
                "name": "The Blue Sky Hotel & Lounge",
                "name_en": "The Blue Sky Hotel & Lounge",
                "category": "hotel",
                "description": "Сүхбаатарын талбайн хажууд байрлах тансаг зэрэглэлийн зочид буудал, панорама харагдацтай лоунж.",
                "description_en": "Iconic sail-shaped 5-star hotel located right in the city center with panoramic skyline cocktail lounges.",
                "address": "Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө",
                "phone": "7010-0505",
                "working_hours": "24 цаг",
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
                "rating": 4.8,
                "review_count": 2,
                "is_verified": True,
                "is_featured": True,
                "price_level": "₮₮₮"
            },
            {
                "name": "Fat Cat Jazz Club",
                "name_en": "Fat Cat Jazz Club",
                "category": "nightlife",
                "description": "Улаанбаатарын амьд жазз хөгжмийн өлгий, тухтай лоунж, олон улсын коктейль.",
                "description_en": "Intimate live jazz club and cocktail speakeasy featuring talented local musicians and vibrant nightlife.",
                "address": "Сүхбаатарын талбайн зүүн урд талд",
                "phone": "8800-4321",
                "working_hours": "19:00 - 02:00",
                "image_url": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
                "rating": 4.9,
                "review_count": 1,
                "is_verified": False,
                "is_featured": False,
                "price_level": "₮₮"
            },
            {
                "name": "Shangri-La Hotel Ulaanbaatar",
                "name_en": "Shangri-La Hotel Ulaanbaatar",
                "category": "hotel",
                "description": "Улаанбаатарын тэргүүлэх 5 одтой олон улсын зочид буудал, тансаг спа, дээд зэрэглэлийн үйлчилгээ.",
                "description_en": "Premier 5-star international hotel in downtown Ulaanbaatar with luxury spa, fine dining, and executive suites.",
                "address": "Сүхбаатар дүүрэг, Олимпийн гудамж 19",
                "phone": "7702-9999",
                "working_hours": "24 цаг",
                "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
                "rating": 4.9,
                "review_count": 4,
                "is_verified": True,
                "is_featured": True,
                "price_level": "₮₮₮"
            },
            {
                "name": "UBean Coffee Roasters",
                "name_en": "UBean Coffee Roasters",
                "category": "cafe",
                "description": "Шинэхэн хуурсан тусгай сортын кофе, амтат десерт, залуусын бүтээлч уур амьсгалтай тухтай кофе шоп.",
                "description_en": "Artisan specialty coffee roastery offering freshly roasted origin beans and cozy laptop-friendly workspaces.",
                "address": "Сүхбаатар дүүрэг, Амарын гудамж",
                "phone": "7744-5566",
                "working_hours": "08:30 - 21:00",
                "image_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
                "rating": 4.8,
                "review_count": 3,
                "is_verified": True,
                "is_featured": False,
                "price_level": "₮₮"
            },
            {
                "name": "Чойжин Ламын Сүм Музей",
                "name_en": "Choijin Lama Temple Museum",
                "category": "attraction",
                "description": "XX зууны эхэн үеийн буддын шашны хосгүй уран барилга, цам хайлгын нандин өв дурсгалууд.",
                "description_en": "Breathtaking early 20th-century Buddhist architectural complex preserving exquisite Tsam religious art and statues.",
                "address": "Сүхбаатар дүүрэг, Чойжин ламын гудамж",
                "phone": "11-324942",
                "working_hours": "10:00 - 17:30",
                "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
                "rating": 4.8,
                "review_count": 3,
                "is_verified": True,
                "is_featured": False,
                "price_level": "₮₮"
            },
            {
                "name": "Veranda Mediterranean Restaurant",
                "name_en": "Veranda Restaurant",
                "category": "restaurant",
                "description": "Чойжин сүмийг тольдон харах панорама тагт, гар хийцийн итали паста, сонгодог пицца, дарсны цуглуулга.",
                "description_en": "Chic Mediterranean dining overlooking the ancient temple with handmade pastas, artisan pizzas, and fine wines.",
                "address": "Чойжин ламын сүмийн хойно, 2-р давхар",
                "phone": "11-330818",
                "working_hours": "11:00 - 23:00",
                "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
                "rating": 4.7,
                "review_count": 4,
                "is_verified": True,
                "is_featured": True,
                "price_level": "₮₮"
            },
            {
                "name": "Zaisan Hill Complex",
                "name_en": "Zaisan Hill Complex",
                "category": "attraction",
                "description": "Улаанбаатар хотыг бүхэлд нь тольдон харах шилэн гүүр, үзвэр үйлчилгээ, кино театр, дээд зэрэглэлийн ресторанууд.",
                "description_en": "Iconic modern lifestyle hub at Zaisan with panoramic glass skywalk, fine restaurants, shopping, and entertainment.",
                "address": "Хан-Уул дүүрэг, Зайсан толгой",
                "phone": "7711-8899",
                "working_hours": "10:00 - 24:00",
                "image_url": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
                "rating": 4.8,
                "review_count": 5,
                "is_verified": True,
                "is_featured": True,
                "price_level": "₮₮"
            }
        ]

        added_count = 0
        for data in all_places_data:
            existing = db.query(Place).filter(Place.name == data["name"]).first()
            if not existing:
                new_place = Place(**data)
                db.add(new_place)
                added_count += 1

        db.commit()
        print(f"Places check complete! Added {added_count} new spots.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_places()
