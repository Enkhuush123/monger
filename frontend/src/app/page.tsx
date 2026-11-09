import Link from 'next/link';
import Header from '@/components/Header';
import Hero3D from '@/components/Hero3D';
import TrendingWidget from '@/components/TrendingWidget';
import { getApiUrl } from '@/lib/api';
import { DEFAULT_ARTICLES, DEFAULT_PLACES, DEFAULT_BLOGS, DEFAULT_PRIMARY_AD } from '@/lib/fallbackData';
import { 
  Eye, Clock, CloudSun, ChevronRight, Megaphone, ExternalLink, Sparkles, 
  Star, MapPin, ShieldCheck, ArrowUpRight, Compass, Flame 
} from 'lucide-react';

export default async function Home(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  
  // 1. Fetch Articles
  const newsPath = q 
    ? `/api/v1/articles/search?q=${encodeURIComponent(q)}`
    : `/api/v1/articles/`;
    
  let articles = [];
  try {
    const res = await fetch(getApiUrl(newsPath), { cache: 'no-store' });
    if (res.ok) articles = await res.json();
  } catch (e) {
    console.warn("Articles fallback mode:", e);
  }
  if (!articles || articles.length === 0) {
    articles = q 
      ? DEFAULT_ARTICLES.filter(a => a.title.toLowerCase().includes(q.toLowerCase()) || a.content.toLowerCase().includes(q.toLowerCase()))
      : DEFAULT_ARTICLES;
  }

  // 2. Fetch Blogs
  let allBlogs = [];
  try {
    const res = await fetch(getApiUrl("/api/v1/blogs/all/posts"), { cache: 'no-store' });
    if (res.ok) allBlogs = await res.json();
  } catch (e) {
    console.warn("Blogs fallback mode:", e);
  }
  if (!allBlogs || allBlogs.length === 0) {
    allBlogs = DEFAULT_BLOGS;
  }

  // 3. Fetch Active Ads
  let homeAds = [];
  try {
    const res = await fetch(getApiUrl("/api/v1/ads/active?ad_type=home_banner"), { cache: 'no-store' });
    if (res.ok) homeAds = await res.json();
  } catch (e) {
    console.warn("Ads fallback mode:", e);
  }
  if (!homeAds || homeAds.length === 0) {
    homeAds = [DEFAULT_PRIMARY_AD];
  }

  // 4. Fetch Top Places
  let featuredPlaces = [];
  try {
    const res = await fetch(getApiUrl("/api/v1/places/?limit=4"), { cache: 'no-store' });
    if (res.ok) featuredPlaces = await res.json();
  } catch (e) {
    console.warn("Places fallback mode:", e);
  }
  if (!featuredPlaces || featuredPlaces.length === 0) {
    featuredPlaces = DEFAULT_PLACES.slice(0, 4);
  }

  const primaryAd = homeAds.length > 0 ? homeAds[0] : null;

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header q={q} />
      
      {/* 3D HERO SECTION with Ambient Glow */}
      <section className="relative h-[340px] md:h-[420px] bg-gradient-to-b from-[#011409] via-[#052613] to-[#070b09] overflow-hidden flex items-center justify-center pt-16">
        <Hero3D />
        
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#03c75a]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-zinc-950/80 border border-zinc-800/80 px-4 py-1.5 rounded-full text-[11px] font-extrabold text-[#03C75A] mb-4 shadow-xl backdrop-blur-md">
            <Sparkles size={13} className="text-[#03C75A]" />
            Монголын Шинэ Үеийн Портал & Хайлтын Систем
          </div>

          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-2xl leading-tight">
            Мэдээллийн нэгдсэн орон зай
          </h1>
          <p className="text-sm md:text-lg text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Хайлт, шуурхай мэдээ, чөлөөт блог болон шилдэг газруудын нэгдсэн экосистем
          </p>
        </div>
      </section>

      {/* MAIN BENTO LAYOUT */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left/Main Column */}
        <div className="lg:col-span-3 space-y-10">

          {/* SPONSORED BANNER (Naver Style Power Ad) */}
          {primaryAd ? (
            <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-emerald-950/30 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden group hover:border-[#03C75A]/60 transition-all duration-300">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#03C75A]/15 blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#03C75A] text-black px-2.5 py-0.5 rounded-full shadow-sm">
                      Ивээн тэтгэсэн • Ad
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">Албан ёсны сурталчилгаа</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-[#03C75A] transition">
                    {primaryAd.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-5 leading-relaxed">
                    {primaryAd.description}
                  </p>
                  <a
                    href={primaryAd.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#03C75A] hover:bg-[#02b350] text-black text-xs font-black px-5 py-2.5 rounded-xl transition shadow-lg shadow-[#03C75A]/25"
                  >
                    Дэлгэрэнгүй үзэх <ExternalLink size={14} />
                  </a>
                </div>

                {primaryAd.image_url && (
                  <div className="w-full md:w-60 h-40 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-zinc-800 border border-zinc-700/60">
                    <img
                      src={primaryAd.image_url}
                      alt={primaryAd.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Fallback Ad Placement CTA */
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#03C75A]/10 border border-[#03C75A]/20 text-[#03C75A] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Megaphone size={22} />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Та өөрийн бизнесээ энд сурталчлах уу?</h4>
                  <p className="text-xs text-zinc-400">Өдөрт ердөө 15,000₮-өөр Монголын мянга мянган хэрэглэгчдэд бүтээгдэхүүнээ хүргэх боломжтой.</p>
                </div>
              </div>
              <Link
                href="/ads/create"
                className="whitespace-nowrap px-5 py-2.5 bg-[#03C75A] hover:bg-[#02b350] text-black font-extrabold text-xs rounded-xl transition shadow-lg shadow-[#03C75A]/20 flex-shrink-0"
              >
                Зар байршуулах →
              </Link>
            </div>
          )}

          {/* NEWS SECTION */}
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                {q ? `"${q}" хайлтын үр дүн` : "Онцлох Мэдээ"}
              </h2>
            </div>

            {articles.length === 0 ? (
              <div className="bg-zinc-900/50 backdrop-blur-xl p-12 text-center rounded-3xl border border-zinc-800">
                <p className="text-zinc-500 text-sm">Одоогоор мэдээ олдсонгүй.</p>
                {q && <Link href="/" className="text-[#03C75A] font-bold mt-3 inline-block hover:underline text-xs">Бүх мэдээг харах</Link>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article: any) => (
                  <Link key={article.id} href={`/article/${article.id}`} className="group block h-full">
                    <article className="bg-zinc-900/60 backdrop-blur-xl h-full p-6 rounded-3xl border border-zinc-800/80 hover:border-[#03C75A]/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(3,199,90,0.1)]">
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[10px] font-black text-[#03C75A] uppercase tracking-wider bg-[#03C75A]/10 border border-[#03C75A]/20 px-2.5 py-0.5 rounded-md">
                            {article.category?.name || "Мэдээ"}
                          </span>
                          <span className="text-zinc-500 group-hover:text-[#03C75A] transition">
                            <ArrowUpRight size={16} />
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#03C75A] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed mb-6 font-normal">
                          {article.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-800/60">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5"><Eye size={13} /> {article.views}</span>
                          <span className="flex items-center gap-1.5"><Clock size={13} /> {new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        <span className="text-[#03C75A] text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          Унших <ChevronRight size={13} />
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* MONGER PLACE SHOWCASE (Naver Place Bento) */}
          <div className="pt-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#03C75A]/10 text-[#03C75A] border border-[#03C75A]/20 px-2.5 py-0.5 rounded-full">
                    Monger Place
                  </span>
                  <span className="text-xs text-zinc-500">네이버 플레이스 • Tourist Guide</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  📍 Санал Болгох Газрууд & Үнэлгээ
                </h2>
                <p className="text-xs text-zinc-400">Улаанбаатарын шилдэг ресторан, кофе шоп, зочид буудал, үзвэр үйлчилгээ</p>
              </div>
              <Link href="/places" className="text-xs font-extrabold text-[#03C75A] hover:underline flex items-center gap-1 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                Бүгдийг үзэх <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredPlaces.map((pl: any) => (
                <Link key={pl.id} href={`/places/${pl.id}`} className="group block">
                  <div className="bg-zinc-900/60 backdrop-blur-xl p-4 rounded-3xl border border-zinc-800/80 hover:border-[#03C75A]/50 transition-all duration-300 flex items-center gap-4 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(3,199,90,0.1)]">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 relative">
                      <img
                        src={pl.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
                        alt={pl.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 backdrop-blur text-[9px] font-bold text-white px-1.5 py-0.2 rounded">
                        {pl.price_level}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-[#03C75A] uppercase bg-[#03C75A]/10 px-2 py-0.5 rounded">
                          {pl.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                          <Star size={12} fill="currentColor" />
                          <span>{pl.rating.toFixed(1)}</span>
                          <span className="text-zinc-500 font-normal">({pl.review_count})</span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-sm text-white group-hover:text-[#03C75A] transition truncate">
                        {pl.name}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate mb-2">
                        {pl.address}
                      </p>
                      <div className="flex items-center gap-2">
                        {pl.is_verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                            <ShieldCheck size={10} /> SmartPlace
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {pl.working_hours}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BLOGS SECTION (Naver Blog Clone) */}
          <div className="pt-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Шинэ Нийтлэл & Блогууд
                </h2>
                <p className="text-xs text-zinc-400">Чөлөөт нийтлэлч, блогчдын хамгийн сүүлийн үеийн бичвэрүүд</p>
              </div>
              <Link href="/write/blog" className="text-xs font-bold text-[#03C75A] hover:underline flex items-center gap-1 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                Миний Блог нээх <ChevronRight size={14} />
              </Link>
            </div>

            {allBlogs.length === 0 ? (
              <div className="bg-zinc-900/50 backdrop-blur-xl p-8 text-center rounded-3xl border border-zinc-800">
                <p className="text-zinc-500 text-xs">Одоогоор блог нийтлэл алга байна.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allBlogs.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.username}`} className="group block h-full">
                    <article className="bg-zinc-900/60 backdrop-blur-xl h-full p-6 rounded-3xl border border-zinc-800/80 hover:border-[#03C75A]/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(3,199,90,0.1)]">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#03C75A] bg-[#03C75A]/10 px-2.5 py-1 rounded-md border border-[#03C75A]/20">
                          @{post.username} • {post.blog_title}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#03C75A] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed font-normal">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 pt-3 border-t border-zinc-800/60">
                        <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Real-time Trending Widget */}
          <TrendingWidget />

          {/* Self-serve Ad Promotion Card */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-[#022210] p-6 rounded-3xl shadow-xl border border-zinc-800 text-left relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-3 translate-y-3 group-hover:scale-110 transition duration-500">
              <Megaphone size={110} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#03C75A] bg-[#03C75A]/10 px-2.5 py-0.5 rounded-full border border-[#03C75A]/20 mb-3 inline-block">
              Бизнесийн Сурталчилгаа
            </span>
            <h3 className="font-black text-lg text-white mb-2">Monger Ads</h3>
            <p className="text-zinc-400 text-xs mb-5 leading-relaxed font-normal">
              QPay-ээр төлбөрөө хийж өөрийн бүтээгдэхүүн, үйлчилгээгээ Монгол даяар танилцуул.
            </p>
            <Link
              href="/ads/create"
              className="inline-block w-full text-center bg-[#03C75A] hover:bg-[#02b350] text-black font-extrabold py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-[#03C75A]/25"
            >
              Зар байршуулах (15,000₮-өөс)
            </Link>
          </div>

          {/* Weather Station Widget */}
          <div className="bg-zinc-900/70 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/80 shadow-xl relative overflow-hidden">
            <div className="absolute -right-3 -top-3 text-emerald-500/10 pointer-events-none">
              <CloudSun size={110} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                Улаанбаатар
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Цаг агаар</span>
            </div>
            <div className="relative z-10">
              <p className="text-5xl font-black text-white tracking-tighter mb-2">+15°</p>
              <p className="text-emerald-400 font-medium text-xs">Цэлмэг, салхи багатай</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
