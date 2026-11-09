"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getApiUrl } from "@/lib/api";
import { DEFAULT_PLACES } from "@/lib/fallbackData";
import { 
  Star, MapPin, Phone, Clock, ShieldCheck, ChevronLeft, 
  Send, MessageSquare, CheckCircle, ChevronDown, Check, Share2, Compass, ExternalLink 
} from "lucide-react";

type Lang = "mn" | "ko" | "en" | "ja";

const LANGUAGES: { code: Lang; name: string; flag: string }[] = [
  { code: "mn", name: "Монгол", flag: "🇲🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ja", name: "日本語", flag: "🇯🇵" }
];

const UI_TEXT: Record<Lang, any> = {
  mn: {
    back: "Бүх газрууд руу буцах",
    verified: "SmartPlace Баталгаажсан Профайл",
    reviewsCount: "бодит үнэлгээтэй",
    call: "Шууд залгах",
    share: "Хуваалцах",
    reviewTitle: "Үнэлгээ & Сэтгэгдлүүд",
    writeReview: "Та өөрийн бодит сэтгэгдэл, үнэлгээг үлдээх",
    yourRating: "Таны үнэлгээ (1-5 од):",
    namePlaceholder: "Таны нэр (Заавал биш)",
    commentPlaceholder: "Хоолны амт, үйлчилгээний соёл, уур амьсгалын талаар бичнэ үү...",
    submitBtn: "Үнэлгээ илгээх",
    submitting: "Илгээж байна...",
    success: "Таны сэтгэгдэл амжилттай нийтлэгдлээ!",
    noReviews: "Одоогоор сэтгэгдэл алга байна. Та хамгийн анхны үнэлгээг үлдээгээрэй!"
  },
  ko: {
    back: "플레이스 목록으로",
    verified: "스마트플레이스 공식 인증",
    reviewsCount: "개의 실사용자 리뷰",
    call: "전화 문의",
    share: "공유하기",
    reviewTitle: "방문자 리뷰 및 평가",
    writeReview: "방문자 리뷰 남기기",
    yourRating: "별점 평가 (1~5점):",
    namePlaceholder: "이름 또는 닉네임",
    commentPlaceholder: "음식 맛, 서비스, 위생, 분위기 등 솔직한 후기를 남겨주세요...",
    submitBtn: "리뷰 등록하기",
    submitting: "등록 중...",
    success: "리뷰가 성공적으로 등록되었습니다!",
    noReviews: "아직 등록된 리뷰가 없습니다. 첫 번째 리뷰어가 되어보세요!"
  },
  en: {
    back: "Back to All Places",
    verified: "SmartPlace Verified Profile",
    reviewsCount: "verified ratings",
    call: "Call Now",
    share: "Share",
    reviewTitle: "Ratings & Guest Reviews",
    writeReview: "Leave an authentic review",
    yourRating: "Your Rating (1-5 Stars):",
    namePlaceholder: "Your name (optional)",
    commentPlaceholder: "Share details of your own experience at this place...",
    submitBtn: "Post Review",
    submitting: "Submitting...",
    success: "Your review was posted successfully!",
    noReviews: "No reviews yet. Be the first to leave feedback!"
  },
  ja: {
    back: "スポット一覧へ戻る",
    verified: "公式スマートプレイス認証",
    reviewsCount: "件の口コミ",
    call: "電話する",
    share: "共有",
    reviewTitle: "口コミ・評価",
    writeReview: "口コミを投稿する",
    yourRating: "評価 (1〜5つ星):",
    namePlaceholder: "お名前（任意）",
    commentPlaceholder: "料理の味、接客、店内の雰囲気などについてご記入ください...",
    submitBtn: "口コミを投稿",
    submitting: "送信中...",
    success: "口コミを投稿しました！",
    noReviews: "まだ口コミがありません。最初の投稿者になりましょう！"
  }
};

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

export default function PlaceDetailPage() {
  const params = useParams();
  const placeId = params?.id ? Number(params.id) : 1;
  const fallbackPlace = DEFAULT_PLACES.find(p => p.id === Number(placeId)) || DEFAULT_PLACES[0];

  const [place, setPlace] = useState<any>(fallbackPlace);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("mn");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const t = UI_TEXT[lang];

  const fetchPlace = () => {
    if (!placeId) return;
    fetch(getApiUrl(`/api/v1/places/${placeId}`))
      .then(res => {
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
      })
      .then(data => {
        if (data && data.name) {
          setPlace(data);
        } else {
          setPlace(fallbackPlace);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using default place detail:", err);
        setPlace(fallbackPlace);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlace();
  }, [placeId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl(`/api/v1/places/${placeId}/reviews`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: Number(rating),
          author_name: authorName || "Зочин (Traveler)",
          comment
        })
      });

      if (res.ok) {
        setComment("");
        setReviewSuccess(true);
        fetchPlace();
        setTimeout(() => setReviewSuccess(false), 4000);
      } else {
        throw new Error("API error");
      }
    } catch (e) {
      console.warn("Review fallback store:", e);
      const newRev = {
        id: Date.now(),
        author_name: authorName || "Зочин (Traveler)",
        rating: Number(rating),
        comment,
        created_at: new Date().toISOString()
      };
      setPlace((prev: any) => ({
        ...prev,
        review_count: (prev?.review_count || 0) + 1,
        reviews: [newRev, ...(prev?.reviews || [])]
      }));
      setComment("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place?.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Холбоосыг хууллаа!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b09] flex items-center justify-center text-zinc-500 font-medium">
        Loading Monger Place...
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-[#070b09] flex flex-col items-center justify-center text-white">
        <h2 className="text-xl font-bold mb-2">Газар олдсонгүй</h2>
        <Link href="/places" className="text-[#03C75A] font-bold">Буцах</Link>
      </div>
    );
  }

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const placeLocale = PLACE_LOCALES[place.id]?.[lang];
  const displayName = placeLocale?.name || (lang !== "mn" && place.name_en ? place.name_en : place.name);
  const displayDesc = placeLocale?.desc || (lang !== "mn" && place.description_en ? place.description_en : place.description);

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header />

      <main className="max-w-5xl mx-auto pt-28 pb-24 px-4 sm:px-6">
        
        {/* Top Bar: Back & Language Switcher */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#03C75A] transition bg-zinc-900/60 px-4 py-2 rounded-full border border-zinc-800"
          >
            <ChevronLeft size={16} />
            {t.back}
          </Link>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-700/80 px-4 py-2 rounded-full text-xs font-bold text-zinc-200 transition shadow-lg"
            >
              <span>{currentLangObj.flag}</span>
              <span>{currentLangObj.name}</span>
              <ChevronDown size={14} className="text-zinc-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-zinc-900/95 backdrop-blur-2xl border border-zinc-700/80 rounded-2xl shadow-2xl p-1.5 z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      lang === l.code ? "bg-[#03C75A]/20 text-[#03C75A]" : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </div>
                    {lang === l.code && <Check size={14} className="text-[#03C75A]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* HERO DETAIL CARD */}
        <div className="bg-zinc-900/70 backdrop-blur-2xl rounded-3xl border border-zinc-800/80 overflow-hidden shadow-2xl mb-10">
          
          {/* Big Cinematic Image Header */}
          <div className="relative h-72 sm:h-96 w-full bg-zinc-950 overflow-hidden">
            <img
              src={place.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
              alt={displayName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            {/* Floating verification badge */}
            {place.is_verified && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-blue-600/90 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                <ShieldCheck size={16} />
                {t.verified}
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 bg-black/60 backdrop-blur-md hover:bg-black text-white rounded-full transition border border-white/10"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Title on Image bottom */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-[#03C75A] bg-[#03C75A]/20 px-3 py-1 rounded-full border border-[#03C75A]/30 mb-2 inline-block">
                  {place.category}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {displayName}
                </h1>
              </div>

              {/* Rating Big Badge */}
              <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/80 px-5 py-3 rounded-2xl shadow-xl flex-shrink-0">
                <Star size={32} fill="#f59e0b" className="text-amber-400" />
                <div>
                  <div className="text-3xl font-black text-white leading-none">
                    {place.rating.toFixed(1)}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    {place.review_count} {t.reviewsCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Action Bar */}
          <div className="p-6 sm:p-8">
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
              {displayDesc}
            </p>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-zinc-950/60 rounded-2xl border border-zinc-800 text-xs mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center text-[#03C75A]">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-bold uppercase">Location</span>
                  <span className="text-zinc-200 font-medium">{place.address}</span>
                </div>
              </div>

              {place.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center text-[#03C75A]">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] font-bold uppercase">Phone</span>
                    <a href={`tel:${place.phone}`} className="text-[#03C75A] font-bold hover:underline">
                      {place.phone}
                    </a>
                  </div>
                </div>
              )}

              {place.working_hours && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center text-[#03C75A]">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] font-bold uppercase">Hours</span>
                    <span className="text-zinc-200 font-medium">{place.working_hours}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {place.phone && (
                <a
                  href={`tel:${place.phone}`}
                  className="flex items-center gap-2 bg-[#03C75A] hover:bg-[#02b350] text-black font-extrabold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-[#03C75A]/20"
                >
                  <Phone size={14} />
                  {t.call}: {place.phone}
                </a>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold px-6 py-3 rounded-xl text-xs transition border border-zinc-700"
              >
                <Share2 size={14} />
                {t.share}
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS & RATING SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="font-extrabold text-xl text-white flex items-center gap-2.5">
              <MessageSquare size={22} className="text-[#03C75A]" />
              {t.reviewTitle} ({place.reviews?.length || 0})
            </h3>
          </div>

          {/* Add Review Box */}
          <form onSubmit={handleReviewSubmit} className="bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-zinc-800/80 space-y-5">
            <h4 className="font-bold text-sm text-white">
              {t.writeReview}
            </h4>

            {reviewSuccess && (
              <div className="p-3.5 bg-[#03C75A]/10 border border-[#03C75A]/30 text-[#03C75A] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle size={16} />
                {t.success}
              </div>
            )}

            {/* Interactive Stars */}
            <div>
              <span className="text-xs text-zinc-400 font-medium block mb-2">
                {t.yourRating}
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      size={26}
                      className={star <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-400 ml-2">{rating} / 5</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
              />
            </div>

            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
            />

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#03C75A] hover:bg-[#02b350] text-black text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#03C75A]/20"
            >
              <Send size={14} />
              {submitting ? t.submitting : t.submitBtn}
            </button>
          </form>

          {/* Reviews List */}
          {(!place.reviews || place.reviews.length === 0) ? (
            <p className="text-xs text-zinc-500 py-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800">
              {t.noReviews}
            </p>
          ) : (
            <div className="space-y-3.5">
              {place.reviews.map((rev: any) => (
                <div key={rev.id} className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-[#03C75A]">
                        {rev.author_name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="font-bold text-xs text-zinc-200">{rev.author_name}</span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap pl-9">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
