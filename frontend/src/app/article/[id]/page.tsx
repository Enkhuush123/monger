import Link from 'next/link';
import Header from '@/components/Header';
import { getApiUrl } from '@/lib/api';
import { DEFAULT_ARTICLES } from '@/lib/fallbackData';
import { Clock, Eye, User, ArrowLeft, Share2, Sparkles } from 'lucide-react';

export default async function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let article = null;
  try {
    const res = await fetch(getApiUrl(`/api/v1/articles/${id}`), { cache: 'no-store' });
    if (res.ok) article = await res.json();
  } catch (e) {
    console.warn("Article fallback mode:", e);
  }

  if (!article) {
    article = DEFAULT_ARTICLES.find(a => a.id === Number(id)) || DEFAULT_ARTICLES[0];
  }

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header />

      <main className="max-w-4xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#03C75A] transition bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800"
          >
            <ArrowLeft size={14} /> Нүүр хуудас руу буцах
          </Link>
        </div>

        <article className="bg-zinc-900/70 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-zinc-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#03C75A]/10 blur-3xl pointer-events-none" />

          <header className="mb-8 border-b border-zinc-800/80 pb-6 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-black text-[#03C75A] uppercase tracking-wider bg-[#03C75A]/10 border border-[#03C75A]/20 px-3 py-1 rounded-full">
                {article.category?.name || "Шуурхай мэдээ"}
              </span>
              <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                <Sparkles size={12} className="text-[#03C75A]" /> Monger News Feed
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white mb-5 leading-tight tracking-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400 pt-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <User size={14} className="text-[#03C75A]" /> {article.author?.username || "Monger AI Сэтгүүлч"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {new Date(article.created_at || Date.now()).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} /> {article.views || 1200} үзсэн
                </span>
              </div>
            </div>
          </header>
          
          <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-normal relative z-10">
            {article.content}
          </div>
        </article>
      </main>
    </div>
  );
}
