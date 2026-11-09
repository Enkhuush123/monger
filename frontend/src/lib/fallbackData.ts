export interface PlaceReviewItem {
  id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface PlaceItem {
  id: number;
  name: string;
  name_en: string;
  category: "restaurant" | "cafe" | "hotel" | "attraction" | "nightlife";
  description: string;
  description_en: string;
  address: string;
  phone: string;
  working_hours: string;
  image_url: string;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_featured: boolean;
  price_level: string;
  reviews?: PlaceReviewItem[];
}

export const DEFAULT_PLACES: PlaceItem[] = [
  {
    id: 1,
    name: "Чингис Хаан Үндэсний Музей",
    name_en: "Chinggis Khaan National Museum",
    category: "attraction",
    description: "Монголын төрт ёсны 2000 гаруй жилийн түүхийг харуулсан Азийн тэргүүлэгч орчин үеийн музей.",
    description_en: "A state-of-the-art modern museum displaying over 2,000 years of nomadic statehood and royal imperial heritage.",
    address: "Сүхбаатар дүүрэг, Их сургуулийн гудамж",
    phone: "7011-0099",
    working_hours: "09:00 - 18:00 (Мягмар гарагт амарна)",
    image_url: "https://images.unsplash.com/photo-1599818816949-923c8a980590?w=800&q=80",
    rating: 4.9,
    review_count: 38,
    is_verified: true,
    is_featured: true,
    price_level: "₮₮",
    reviews: [
      { id: 101, author_name: "Min-jun Kim (한국)", rating: 5, comment: "시설이 매우 현대적이고 오디오 가이드가 잘 되어 있어서 몽골 역사를 이해하기에 최고였습니다. 꼭 가보세요!", created_at: "2026-11-02T10:00:00Z" },
      { id: 102, author_name: "Sarah Jenkins (UK)", rating: 5, comment: "Spectacular curation and stunning artifacts. Truly world class museum!", created_at: "2026-11-04T12:30:00Z" },
      { id: 103, author_name: "Билгүүн", rating: 5, comment: "Монгол хүн бүрийн заавал очиж үзэх ёстой бахархалт газар. Хөтөч тайлбарлагч нар маш чадварлаг.", created_at: "2026-11-06T15:20:00Z" }
    ]
  },
  {
    id: 2,
    name: "ROC Caffeine Bar",
    name_en: "ROC Caffeine Bar",
    category: "cafe",
    description: "Улаанбаатарын тусгай кофены соёлыг түгээгч, шилдэг бариста нарын бүтээл, тохилог орчин.",
    description_en: "Premier specialty coffee shop in Ulaanbaatar, renowned for artisan espresso roasts and cozy work-friendly atmosphere.",
    address: "Сүхбаатар дүүрэг, Сөүлийн гудамж",
    phone: "7711-2233",
    working_hours: "08:00 - 22:00",
    image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    rating: 4.8,
    review_count: 24,
    is_verified: true,
    is_featured: true,
    price_level: "₮₮",
    reviews: [
      { id: 201, author_name: "Ji-hye Park", rating: 5, comment: "서울의 힙한 성수동 카페에 온 듯한 감성! 플랫화이트와 바나나브레드가 정말 맛있습니다.", created_at: "2026-11-05T09:15:00Z" },
      { id: 202, author_name: "Номин", rating: 5, comment: "Ажиллахад болон найзуудтайгаа уулзахад хамгийн тухтай орчинтой кофе шоп.", created_at: "2026-11-07T14:40:00Z" }
    ]
  },
  {
    id: 3,
    name: "Modern Nomads Ресторан",
    name_en: "Modern Nomads Restaurant",
    category: "restaurant",
    description: "Уламжлалт монгол хоолыг европ соёлтой хослуулсан, гадаад дотоодын зочдын дуртай газар.",
    description_en: "Famous traditional Mongolian restaurant offering modern fusion nomadic cuisine, buuz, and steppe delicacies.",
    address: "Чингэлтэй дүүрэг, Бага тойруу",
    phone: "11-318744",
    working_hours: "10:00 - 23:00",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    rating: 4.7,
    review_count: 42,
    is_verified: true,
    is_featured: false,
    price_level: "₮₮",
    reviews: [
      { id: 301, author_name: "Kenji Sato (Japan)", rating: 5, comment: "羊肉の臭みが全くなく、ボーズとホーショールが絶品でした。スタッフも親切です。", created_at: "2026-11-03T18:00:00Z" },
      { id: 302, author_name: "Тэмүүлэн", rating: 5, comment: "Гадаадаас ирсэн найзуудаа дагуулж очиход нүүр улайхааргүй найдвартай ресторан.", created_at: "2026-11-06T19:30:00Z" }
    ]
  },
  {
    id: 4,
    name: "The Blue Sky Hotel & Lounge",
    name_en: "The Blue Sky Hotel & Lounge",
    category: "hotel",
    description: "Сүхбаатарын талбайн хажууд байрлах тансаг зэрэглэлийн зочид буудал, панорама харагдацтай лоунж.",
    description_en: "Iconic sail-shaped 5-star hotel located right in the city center with panoramic skyline cocktail lounges.",
    address: "Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө",
    phone: "7010-0505",
    working_hours: "24 цаг",
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    rating: 4.8,
    review_count: 56,
    is_verified: true,
    is_featured: true,
    price_level: "₮₮₮",
    reviews: [
      { id: 401, author_name: "Michael Chang", rating: 5, comment: "The 23rd floor lounge offers the best night view of Sukhbaatar square. Excellent cocktails and service.", created_at: "2026-11-01T21:00:00Z" }
    ]
  },
  {
    id: 5,
    name: "Fat Cat Jazz Club",
    name_en: "Fat Cat Jazz Club",
    category: "nightlife",
    description: "Улаанбаатарын амьд жазз хөгжмийн өлгий, тухтай лоунж, олон улсын коктейль.",
    description_en: "Intimate live jazz club and cocktail speakeasy featuring talented local musicians and vibrant nightlife.",
    address: "Сүхбаатарын талбайн зүүн урд талд",
    phone: "8800-4321",
    working_hours: "19:00 - 02:00",
    image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
    rating: 4.9,
    review_count: 31,
    is_verified: true,
    is_featured: false,
    price_level: "₮₮",
    reviews: [
      { id: 501, author_name: "Ариунаа", rating: 5, comment: "Улаанбаатарт амьд хөгжим сонсож, тухтай ярилцаж суух хамгийн гоё сэтгэл татам газар.", created_at: "2026-11-08T22:15:00Z" }
    ]
  },
  {
    id: 6,
    name: "Shangri-La Hotel Ulaanbaatar",
    name_en: "Shangri-La Hotel Ulaanbaatar",
    category: "hotel",
    description: "Улаанбаатарын тэргүүлэх 5 одтой олон улсын зочид буудал, тансаг спа, дээд зэрэглэлийн үйлчилгээ.",
    description_en: "Premier 5-star international hotel in downtown Ulaanbaatar with luxury spa, fine dining, and executive suites.",
    address: "Сүхбаатар дүүрэг, Олимпийн гудамж 19",
    phone: "7702-9999",
    working_hours: "24 цаг",
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    rating: 4.9,
    review_count: 67,
    is_verified: true,
    is_featured: true,
    price_level: "₮₮₮",
    reviews: [
      { id: 601, author_name: "James L.", rating: 5, comment: "First-class service and outstanding breakfast buffet. Best hotel in UB hands down.", created_at: "2026-11-07T08:30:00Z" }
    ]
  },
  {
    id: 7,
    name: "UBean Coffee Roasters",
    name_en: "UBean Coffee Roasters",
    category: "cafe",
    description: "Шинэхэн хуурсан тусгай сортын кофе, амтат десерт, залуусын бүтээлч уур амьсгалтай тухтай кофе шоп.",
    description_en: "Artisan specialty coffee roastery offering freshly roasted origin beans and cozy laptop-friendly workspaces.",
    address: "Сүхбаатар дүүрэг, Амарын гудамж",
    phone: "7744-5566",
    working_hours: "08:30 - 21:00",
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    rating: 4.8,
    review_count: 19,
    is_verified: true,
    is_featured: false,
    price_level: "₮₮"
  },
  {
    id: 8,
    name: "Чойжин Ламын Сүм Музей",
    name_en: "Choijin Lama Temple Museum",
    category: "attraction",
    description: "XX зууны эхэн үеийн буддын шашны хосгүй уран барилга, цам хайлгын нандин өв дурсгалууд.",
    description_en: "Breathtaking early 20th-century Buddhist architectural complex preserving exquisite Tsam religious art and statues.",
    address: "Сүхбаатар дүүрэг, Чойжин ламын гудамж",
    phone: "11-324942",
    working_hours: "10:00 - 17:30",
    image_url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    rating: 4.8,
    review_count: 27,
    is_verified: true,
    is_featured: false,
    price_level: "₮₮"
  },
  {
    id: 9,
    name: "Veranda Mediterranean Restaurant",
    name_en: "Veranda Restaurant",
    category: "restaurant",
    description: "Чойжин сүмийг тольдон харах панорама тагт, гар хийцийн итали паста, сонгодог пицца, дарсны цуглуулга.",
    description_en: "Chic Mediterranean dining overlooking the ancient temple with handmade pastas, artisan pizzas, and fine wines.",
    address: "Чойжин ламын сүмийн хойно, 2-р давхар",
    phone: "11-330818",
    working_hours: "11:00 - 23:00",
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    rating: 4.7,
    review_count: 45,
    is_verified: true,
    is_featured: true,
    price_level: "₮₮"
  },
  {
    id: 10,
    name: "Zaisan Hill Complex",
    name_en: "Zaisan Hill Complex",
    category: "attraction",
    description: "Улаанбаатар хотыг бүхэлд нь тольдон харах шилэн гүүр, үзвэр үйлчилгээ, кино театр, дээд зэрэглэлийн ресторанууд.",
    description_en: "Iconic modern lifestyle hub at Zaisan with panoramic glass skywalk, fine restaurants, shopping, and entertainment.",
    address: "Хан-Уул дүүрэг, Зайсан толгой",
    phone: "7711-8899",
    working_hours: "10:00 - 24:00",
    image_url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
    rating: 4.8,
    review_count: 52,
    is_verified: true,
    is_featured: true,
    price_level: "₮₮"
  }
];

export const DEFAULT_ARTICLES = [
  {
    id: 1,
    title: "Монгол залуус хиймэл оюун ухаанд суурилсан шинэ хайлтын систем бүтээлээ",
    content: "Мэдээллийн эрин зуунд Монгол хэл дээрх мэдээлэл, нийтлэлүүдийг нэгтгэн хамгийн хурдан шуурхай хайх 'Monger' платформ туршилтын хувилбараа олон нийтэд танилцууллаа. Систем нь бодит цагийн мэдээ, блогоос гадна бизнесүүдийг холбосон дижитал лавлах агуулжээ.",
    category: { name: "Технологи", slug: "tech" },
    views: 2450,
    created_at: "2026-11-09T08:00:00Z"
  },
  {
    id: 2,
    title: "Монголбанкны бодлогын хүү болон эдийн засгийн төлөв байдал",
    content: "Инфляцийн түвшин тогтворжиж, гадаад худалдааны тэнцэл ашигтай гарснаар төгрөгийн ханш чангарах хандлагатай байна гэж эдийн засагчид дүгнэв. Мөн дотоодын хувийн хэвшлийн экспортын дэмжлэг нэмэгджээ.",
    category: { name: "Эдийн засаг", slug: "economy" },
    views: 1820,
    created_at: "2026-11-09T07:15:00Z"
  },
  {
    id: 3,
    title: "Улаанбаатар хотын агаарын чанар ба сэргээгдэх эрчим хүчний төслүүд",
    content: "Нийслэлийн захиргаанаас ногоон эрчим хүч болон цахилгаан нийтийн тээврийг нэмэгдүүлэх хөрөнгө оруулалтыг шийдвэрлэж, эко хот байгуулалтын дараагийн шатны бүтээн байгуулалтуудыг зарлалаа.",
    category: { name: "Нийгэм", slug: "society" },
    views: 1290,
    created_at: "2026-11-09T06:30:00Z"
  },
  {
    id: 4,
    title: "Nvidia болон OpenAI шинэ үеийн хиймэл оюуны чип, моделиудыг танилцууллаа",
    content: "Дэлхийн технологийн аваргууд тооцоолох хүчин чадлыг 3 дахин нэмэгдүүлж, эрчим хүчний зарцуулалтыг 40% бууруулсан дараагийн үеийн хиймэл оюуны архитектурыг амжилттай туршиж дууссанаа мэдээлэв.",
    category: { name: "Технологи", slug: "tech" },
    views: 3100,
    created_at: "2026-11-09T05:00:00Z"
  }
];

export const DEFAULT_TRENDS = [
  { id: 1, keyword: "Monger Хайлт", count: 120 },
  { id: 2, keyword: "Чингис хаан музей", count: 98 },
  { id: 3, keyword: "Төгрөгийн ханш", count: 85 },
  { id: 4, keyword: "ROC кофе шоп", count: 74 },
  { id: 5, keyword: "AI мэдээний робот", count: 62 },
  { id: 6, keyword: "Шангри-Ла зочид буудал", count: 58 },
  { id: 7, keyword: "Улаанбаатар цаг агаар", count: 50 },
  { id: 8, keyword: "Сэргээгдэх эрчим хүч", count: 44 }
];

export const DEFAULT_BLOGS = [
  {
    id: 1,
    title: "Монголын технологийн стартапуудын ирээдүй: Бид хаашаа явж байна вэ?",
    content: "Бид дэлхийн жишигт нийцсэн өөрсдийн хайлтын систем, ухаалаг экосистемийг бүтээн хөгжүүлж чадах уу? Энэ нийтлэлээр шинэ гарч ирж буй боломжуудыг задлан шинжилж байна.",
    blog: {
      title: "Tech Frontier Mongolia",
      user: { username: "bat_tech" }
    },
    created_at: "2026-11-08T10:00:00Z"
  },
  {
    id: 2,
    title: "Улаанбаатарын хамгийн тохилог 5 ажлын кофе шопууд",
    content: "Номад болон зайнаас ажилладаг залуусын дунд өндөр үнэлгээ авсан, хурдан интернэт, тухтай сандал, амтат кофетой шилдэг газруудын дэлгэрэнгүй жагсаалт.",
    blog: {
      title: "UB Nomad Guide",
      user: { username: "nomad_travel" }
    },
    created_at: "2026-11-07T14:20:00Z"
  }
];

export const DEFAULT_PRIMARY_AD = {
  id: 1,
  title: "Monger SmartPlace — Бизнесээ Олон Улсын Түвшинд Сурталчил",
  description: "Та өөрийн ресторан, кофе шоп, зочид буудлаа Монгол, Англи, Солонгос, Япон хэлээр жуулчид болон дотоодын хэрэглэгчдэд шууд хүргээрэй.",
  target_url: "/places/new",
  image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
};
