"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getApiUrl } from "@/lib/api";
import { DEFAULT_PLACES } from "@/lib/fallbackData";
import { 
  MapPin, Star, Phone, Clock, ShieldCheck, Search, PlusCircle, Globe, 
  Utensils, Coffee, Hotel, Landmark, Sparkles, GlassWater, ChevronDown, Check, Compass, ArrowUpRight
} from "lucide-react";

type Lang = "mn" | "ko" | "en" | "ja";

const LANGUAGES: { code: Lang; name: string; flag: string; title: string }[] = [
  { code: "mn", name: "Монгол", flag: "🇲🇳", title: "Монгол хэл" },
  { code: "ko", name: "한국어", flag: "🇰🇷", title: "한국어 (Korean)" },
  { code: "en", name: "English", flag: "🇬🇧", title: "English" },
  { code: "ja", name: "日本語", flag: "🇯🇵", title: "日本語 (Japanese)" }
];

const UI_TEXT: Record<Lang, any> = {
  mn: {
    heroBadge: "Monger Place • Дижитал Лавлах",
    heroTitle: "Улаанбаатарын Шилдэг Газрууд",
    heroSub: "Монголчууд болон гадаадын зочдын бодит үнэлгээтэй шилдэг ресторан, кофе шоп, үзвэр, үйлчилгээ.",
    searchPlaceholder: "Нэр, байршил, хоолоор хайх...",
    searchBtn: "Хайх",
    registerBtn: "+ Бизнесээ бүртгүүлэх",
    reviews: "үнэлгээ",
    featured: "Онцлох",
    verified: "SmartPlace Баталгаажсан",
    openNow: "Нээлттэй",
    noPlaces: "Газар олдсонгүй",
    noPlacesSub: "Та өөр ангилал эсвэл хайлтын үг сонгоно уу.",
    all: "Бүгд",
    restaurant: "Ресторан",
    cafe: "Кофе шоп",
    hotel: "Зочид буудал",
    attraction: "Үзвэр & Соёл",
    nightlife: "Шөнийн клуб"
  },
  ko: {
    heroBadge: "Monger Place • 몽골 여행 & 맛집 가이드",
    heroTitle: "울란바토르 최고의 핫플레이스",
    heroSub: "한국인 여행객과 현지인이 검증한 울란바토르 최고의 맛집, 카페, 5성급 호텔, 관광명소 안내.",
    searchPlaceholder: "식당, 카페, 명소 이름으로 검색...",
    searchBtn: "검색",
    registerBtn: "+ 매장 등록하기",
    reviews: "개의 리뷰",
    featured: "인기 추천",
    verified: "스마트플레이스 인증",
    openNow: "영업중",
    noPlaces: "등록된 장소가 없습니다",
    noPlacesSub: "다른 카테고리나 검색어를 입력해주세요.",
    all: "전체",
    restaurant: "맛집·식당",
    cafe: "카페·디저트",
    hotel: "호텔·숙소",
    attraction: "관광명소·문화",
    nightlife: "펍·라운지"
  },
  en: {
    heroBadge: "Monger Place • City & Tourist Guide",
    heroTitle: "Discover Mongolia's Best Spots",
    heroSub: "Curated collection of verified restaurants, artisan cafes, boutique hotels, and cultural landmarks.",
    searchPlaceholder: "Search by place name, cuisine, district...",
    searchBtn: "Search",
    registerBtn: "+ Register Place",
    reviews: "reviews",
    featured: "Featured",
    verified: "SmartPlace Verified",
    openNow: "Open Now",
    noPlaces: "No spots found",
    noPlacesSub: "Try switching categories or adjusting your search term.",
    all: "All",
    restaurant: "Restaurants",
    cafe: "Specialty Cafes",
    hotel: "Hotels & Stays",
    attraction: "Culture & Sights",
    nightlife: "Nightlife & Pubs"
  },
  ja: {
    heroBadge: "Monger Place • モンゴル公式観光ガイド",
    heroTitle: "ウランバートルのおすすめスポット",
    heroSub: "旅行者と現地在住者がおすすめする人気のレストラン、カフェ、ホテル、歴史博物館。",
    searchPlaceholder: "場所、レストラン名、住所で検索...",
    searchBtn: "検索",
    registerBtn: "+ スポットを登録",
    reviews: "件の口コミ",
    featured: "おすすめ",
    verified: "公式認証スポット",
    openNow: "営業中",
    noPlaces: "該当するスポットがありません",
    noPlacesSub: "カテゴリーを変更するか、別のキーワードをお試しください。",
    all: "すべて",
    restaurant: "レストラン",
    cafe: "カフェ",
    hotel: "ホテル・宿泊",
    attraction: "観光・名所",
    nightlife: "ナイトライフ"
  }
};

// Multilingual Mock Fallbacks for richer foreign tourist experience
const PLACE_LOCALES: Record<number, Record<Lang, { name: string; desc: string }>> = {
  1: {
    mn: { name: "Чингис Хаан Үндэсний Музей", desc: "Монголын төрт ёсны 2000 гаруй жилийн түүхийг харуулсан Азийн тэргүүлэгч орчин үеийн музей." },
    ko: { name: "칭기즈칸 국립박물관 (Chinggis Khaan Museum)", desc: "몽골 2,000년 유목 역사와 제국 유물을 최신 미디어 아트로 관람할 수 있는 몽골 최대 규모의 국립 박물관." },
    en: { name: "Chinggis Khaan National Museum", desc: "A world-class modern museum showcasing over 2,000 years of nomadic statehood and royal imperial heritage." },
    ja: { name: "チンギス・ハーン国立博物館", desc: "モンゴル帝国の歴史と遊牧文化を展示するアジア最大級の最新鋭国立博物館。" }
  },
  2: {
    mn: { name: "ROC Caffeine Bar", desc: "Улаанбаатарын тусгай кофены соёлыг түгээгч, шилдэг бариста нарын бүтээл, тохилог орчин." },
    ko: { name: "ROC 카페인 바 (ROC Caffeine Bar)", desc: "울란바토르 스페셜티 커피의 성지. 전문 바리스타의 핸드드립 커피와 세련된 인테리어의 감성 카페." },
    en: { name: "ROC Caffeine Bar", desc: "Premier specialty coffee roasters in downtown Ulaanbaatar, famed for artisan pour-overs and cozy ambience." },
    ja: { name: "ROC カフェイン・バー", desc: "ウランバートル屈指のスペシャルティコーヒー店。バリスタが淹れる本格的なエスプレッソが人気。" }
  },
  3: {
    mn: { name: "Modern Nomads Ресторан", desc: "Уламжлалт монгол хоолыг европ соёлтой хослуулсан, гадаад дотоодын зочдын дуртай газар." },
    ko: { name: "모던 노마즈 (Modern Nomads)", desc: "한국인 여행객 필수 코스! 몽골 전통 양고기 요리(호쇼르, 보즈)를 현대적이고 위생적으로 즐기는 퓨전 맛집." },
    en: { name: "Modern Nomads Restaurant", desc: "Beloved traditional Mongolian restaurant serving refined nomadic specialties, hot buuz, and steppe feasts." },
    ja: { name: "モダン・ノーマズ", desc: "伝統的なモンゴル料理を現代風にアレンジした観光客に大人気の有名レストラン。" }
  },
  4: {
    mn: { name: "The Blue Sky Hotel & Lounge", desc: "Сүхбаатарын талбайн хажууд байрлах тансаг зэрэглэлийн зочид буудал, панорама харагдацтай лоунж." },
    ko: { name: "블루스카이 호텔 & 스카이 라운지", desc: "수흐바타르 광장 바로 앞, 돛단배 모양의 랜드마크 5성급 호텔. 시내 전경이 내려다보이는 고급 라운지 바 보유." },
    en: { name: "The Blue Sky Hotel & Lounge", desc: "Iconic sail-shaped 5-star hotel in the heart of Ulaanbaatar with panoramic skyline views and cocktail lounges." },
    ja: { name: "ザ・ブルースカイ ホテル＆ラウンジ", desc: "スフバートル広場に隣接するウランバートルの象徴的ランドマーク5つ星ホテル。" }
  },
  5: {
    mn: { name: "Fat Cat Jazz Club", desc: "Улаанбаатарын амьд жазз хөгжмийн өлгий, тухтай лоунж, олон улсын коктейль." },
    ko: { name: "팻 캣 재즈 클럽 (Fat Cat Jazz Club)", desc: "몽골 현지 실력파 뮤지션들의 라이브 재즈 공연을 즐길 수 있는 이국적인 분위기의 스피크이지 칵테일 바." },
    en: { name: "Fat Cat Jazz Club", desc: "Intimate live jazz sanctuary and cocktail speakeasy featuring talented artists and soul-stirring music." },
    ja: { name: "ファットキャット・ジャズクラブ", desc: "毎晩生演奏が楽しめるウランバートル唯一無二の隠れ家的ジャズクラブ。" }
  },
  6: {
    mn: { name: "Shangri-La Hotel Ulaanbaatar", desc: "Улаанбаатарын тэргүүлэх 5 одтой олон улсын зочид буудал, тансаг спа, дээд зэрэглэлийн үйлчилгээ." },
    ko: { name: "샹그릴라 호텔 울란바토르", desc: "울란바토르 최고급 5성급 럭셔리 호텔. 고급 스파, 쇼핑몰 연결, 최고 수준의 인터내셔널 다이닝." },
    en: { name: "Shangri-La Hotel Ulaanbaatar", desc: "Premier 5-star international hotel in downtown Ulaanbaatar with luxury spa, fine dining, and executive suites." },
    ja: { name: "シャングリ・ラ ホテル ウランバートル", desc: "市中心部に位置する最高級5つ星ホテル。洗練されたサービスと豪華なスパを完備。" }
  },
  7: {
    mn: { name: "UBean Coffee Roasters", desc: "Шинэхэн хуурсан тусгай сортын кофе, амтат десерт, залуусын бүтээлч уур амьсгалтай тухтай кофе шоп." },
    ko: { name: "유빈 커피 로스터스 (UBean Coffee)", desc: "직접 로스팅한 스페셜티 원두 드립 커피와 디저트가 일품인 아늑한 노트북 작업 친화적 카페." },
    en: { name: "UBean Coffee Roasters", desc: "Artisan specialty coffee roastery offering freshly roasted origin beans and cozy laptop-friendly workspaces." },
    ja: { name: "ユービーン・コーヒーロースターズ", desc: "自家焙煎スペシャルティコーヒーとスイーツが自慢の落ち着いたカフェ。" }
  },
  8: {
    mn: { name: "Чойжин Ламын Сүм Музей", desc: "XX зууны эхэн үеийн буддын шашны хосгүй уран барилга, цам хайлгын нандин өв дурсгалууд." },
    ko: { name: "초이진 라마 사원 박물관", desc: "20세기 초 몽골 불교 건축의 걸작이자 신비로운 챠ム 가면과 불교 예술품이 보존된 고즈넉한 사원." },
    en: { name: "Choijin Lama Temple Museum", desc: "Breathtaking early 20th-century Buddhist architectural complex preserving exquisite Tsam religious art and statues." },
    ja: { name: "チョイジンラマ寺院博物館", desc: "20世紀初頭のチベット仏教寺院建築と貴重な仏教美術を展示する文化遺産。" }
  },
  9: {
    mn: { name: "Veranda Mediterranean Restaurant", desc: "Чойжин сүмийг тольдон харах панорама тагт, гар хийцийн итали паста, сонгодог пицца, дарсны цуглуулга." },
    ko: { name: "베란다 레스토랑 (Veranda)", desc: "초이진 사원이 한눈에 내려다보이는 야외 테라스 뷰 맛집. 수제 이탈리안 파스타와 와인이 유명한 명소." },
    en: { name: "Veranda Mediterranean Restaurant", desc: "Chic Mediterranean dining overlooking the ancient temple with handmade pastas, artisan pizzas, and fine wines." },
    ja: { name: "ベランダ・レストラン", desc: "寺院を見下ろす美しいテラス席で楽しむ本格手打ちパスタと地中海料理。" }
  },
  10: {
    mn: { name: "Zaisan Hill Complex", desc: "Улаанбаатар хотыг бүхэлд нь тольдон харах шилэн гүүр, үзвэр үйлчилгээ, кино театр, дээд зэрэглэлийн ресторанууд." },
    ko: { name: "자이승 힐 콤플렉스 (Zaisan Hill)", desc: "울란바토르 시내 야경이 한눈에 펼쳐지는 글래스 스카이워크와 고급 레스토랑, 영화관이 모인 복합 랜드마크." },
    en: { name: "Zaisan Hill Complex", desc: "Iconic modern lifestyle hub at Zaisan with panoramic glass skywalk, fine restaurants, shopping, and entertainment." },
    ja: { name: "ザイサン・ヒル・コンプレックス", desc: "市内を一望できるガラスの展望ブリッジと高級レストランが揃うモダン複合施設。" }
  }
};

const CATEGORIES = [
  { id: "all", icon: Sparkles },
  { id: "restaurant", icon: Utensils },
  { id: "cafe", icon: Coffee },
  { id: "hotel", icon: Hotel },
  { id: "attraction", icon: Landmark },
  { id: "nightlife", icon: GlassWater }
];

export default function PlacesPage() {
  const [places, setPlaces] = useState<any[]>(DEFAULT_PLACES);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState<Lang>("mn");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const t = UI_TEXT[lang];

  const fetchPlaces = (category: string, query: string) => {
    let path = `/api/v1/places/?`;
    if (category && category !== "all") path += `category=${category}&`;
    if (query) path += `q=${encodeURIComponent(query)}&`;

    const getFallback = () => {
      return DEFAULT_PLACES.filter(p => {
        const matchCat = category === "all" || p.category === category;
        const qLower = (query || "").toLowerCase();
        const matchQuery = !query || 
          p.name.toLowerCase().includes(qLower) || 
          p.name_en.toLowerCase().includes(qLower) ||
          p.description.toLowerCase().includes(qLower);
        return matchCat && matchQuery;
      });
    };

    fetch(getApiUrl(path))
      .then(res => {
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPlaces(data);
        } else {
          setPlaces(getFallback());
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using default places:", err);
        setPlaces(getFallback());
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaces(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlaces(selectedCategory, searchQuery);
  };

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header />

      {/* HERO SECTION: Ambient Glow & Glassmorphism */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Futuristic background lighting effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#03c75a]/25 via-emerald-600/15 to-teal-400/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Bar: Multi-Language Switcher & Add Place CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            
            {/* Multi-language Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/60 hover:border-[#03C75A]/60 px-4 py-2.5 rounded-full text-xs font-bold text-zinc-200 transition-all shadow-lg shadow-black/40"
              >
                <span className="text-base">{currentLangObj.flag}</span>
                <span>{currentLangObj.name}</span>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-2xl border border-zinc-700/80 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold text-zinc-500 px-3 py-1 uppercase tracking-wider">
                    Select Language
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        lang === l.code 
                          ? "bg-[#03C75A]/20 text-[#03C75A]" 
                          : "text-zinc-300 hover:bg-zinc-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.name}</span>
                      </div>
                      {lang === l.code && <Check size={14} className="text-[#03C75A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SmartPlace CTA */}
            <Link
              href="/places/new"
              className="flex items-center gap-2 bg-[#03C75A] hover:bg-[#02b350] text-black font-extrabold px-5 py-2.5 rounded-full text-xs transition-all shadow-lg shadow-[#03C75A]/25 hover:shadow-[#03C75A]/40 hover:scale-105"
            >
              <PlusCircle size={15} />
              {t.registerBtn}
            </Link>
          </div>

          {/* Hero Typography & Search */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold text-[#03C75A] mb-5 tracking-wide shadow-inner">
              <Compass size={14} className="animate-spin text-[#03C75A]" style={{ animationDuration: '10s' }} />
              {t.heroBadge}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-5 leading-none">
              {t.heroTitle}
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-normal">
              {t.heroSub}
            </p>

            {/* Ultra-Sleek Glass Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#03c75a]/30 to-teal-500/20 rounded-2xl blur-md group-hover:blur-lg transition duration-300 opacity-70" />
              <div className="relative flex items-center bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-1.5 backdrop-blur-xl">
                <Search size={20} className="text-zinc-500 ml-4 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-500 py-2.5"
                />
                <button
                  type="submit"
                  className="bg-[#03C75A] text-black font-extrabold px-6 py-2.5 rounded-xl text-xs hover:bg-[#02b350] transition shadow-md shadow-[#03C75A]/30 flex-shrink-0"
                >
                  {t.searchBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* BENTO / MAIN CATALOG */}
      <main className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Category Filter Chips (Glowing Glass Pills) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-[#03C75A] text-black shadow-lg shadow-[#03C75A]/30 scale-105"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <Icon size={15} />
                {t[cat.id]}
              </button>
            );
          })}
        </div>

        {/* Places Grid: Bento Glass Cards */}
        {loading ? (
          <div className="text-center py-24 text-zinc-500 font-medium animate-pulse">
            Loading Monger Place...
          </div>
        ) : places.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-xl p-16 text-center rounded-3xl border border-zinc-800">
            <MapPin size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="font-bold text-zinc-200 text-lg mb-1">{t.noPlaces}</h3>
            <p className="text-xs text-zinc-500">{t.noPlacesSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => {
              // Localized data mapping
              const placeLocale = PLACE_LOCALES[place.id]?.[lang];
              const displayName = placeLocale?.name || (lang !== "mn" && place.name_en ? place.name_en : place.name);
              const displayDesc = placeLocale?.desc || (lang !== "mn" && place.description_en ? place.description_en : place.description);

              return (
                <Link key={place.id} href={`/places/${place.id}`} className="group block">
                  <article className="relative bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-zinc-800/80 hover:border-[#03C75A]/50 transition-all duration-400 overflow-hidden flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(3,199,90,0.15)] hover:-translate-y-1.5">
                    
                    {/* Cover Image & Badges */}
                    <div className="relative h-56 w-full bg-zinc-800 overflow-hidden">
                      <img
                        src={place.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Gradient scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {place.is_verified && (
                          <span className="flex items-center gap-1.5 bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                            <ShieldCheck size={12} />
                            SmartPlace
                          </span>
                        )}
                        {place.is_featured && (
                          <span className="bg-[#03C75A] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                            {t.featured}
                          </span>
                        )}
                      </div>

                      {/* Price & Open badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="bg-black/70 backdrop-blur-md text-zinc-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/10">
                          {place.price_level}
                        </span>
                      </div>

                      {/* Floating Rating Pill */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                        <Star size={13} fill="#f59e0b" className="text-amber-400" />
                        <span className="text-xs font-black text-white">{place.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">({place.review_count} {t.reviews})</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#03C75A] bg-[#03C75A]/10 border border-[#03C75A]/20 px-2.5 py-0.5 rounded-md">
                            {t[place.category] || place.category}
                          </span>

                          <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-[#03C75A] transition">
                            <ArrowUpRight size={14} />
                          </span>
                        </div>

                        <h3 className="font-extrabold text-lg text-white group-hover:text-[#03C75A] transition-colors line-clamp-1 mb-2">
                          {displayName}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                          {displayDesc}
                        </p>
                      </div>

                      {/* Card Footer Metadata */}
                      <div className="pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
                        <div className="flex items-center gap-2 truncate">
                          <MapPin size={13} className="text-[#03C75A] flex-shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                        {place.working_hours && (
                          <div className="flex items-center gap-2 truncate">
                            <Clock size={13} className="text-zinc-500 flex-shrink-0" />
                            <span className="truncate text-zinc-400 font-mono text-[11px]">{place.working_hours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
