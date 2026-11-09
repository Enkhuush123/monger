import Link from 'next/link';
import { Flame } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { DEFAULT_TRENDS } from '@/lib/fallbackData';

export default async function TrendingWidget() {
  let trends = [];
  try {
    const res = await fetch(getApiUrl("/api/v1/articles/trending"), { cache: 'no-store' });
    if (res.ok) {
      trends = await res.json();
    }
  } catch (e) {
    console.warn("Тренд fallback mode:", e);
  }

  if (!trends || trends.length === 0) {
    trends = DEFAULT_TRENDS;
  }

  return (
    <div className="bg-zinc-900/70 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/80 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <span className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            <Flame size={16} />
          </span>
          Бодит Цагийн Трэнд
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#03C75A] bg-[#03C75A]/10 px-2.5 py-0.5 rounded-full border border-[#03C75A]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#03C75A] animate-pulse" />
          Шууд
        </span>
      </div>

      <ul className="space-y-2 relative z-10">
        {trends.map((trend: any, idx: number) => {
          const isTop3 = idx < 3;
          return (
            <li key={trend.id || idx}>
              <Link
                href={`/?q=${encodeURIComponent(trend.keyword)}`}
                className="group flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800/60 transition"
              >
                <span
                  className={`text-xs font-black w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isTop3
                      ? "bg-[#03C75A] text-black shadow-sm shadow-[#03C75A]/30"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-zinc-300 group-hover:text-[#03C75A] transition flex-1 truncate">
                  {trend.keyword}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono opacity-0 group-hover:opacity-100 transition">
                  хайх →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
