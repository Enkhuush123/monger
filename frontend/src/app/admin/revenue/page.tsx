"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { DollarSign, Eye, MousePointer, ShieldCheck, Clock, Phone, TrendingUp, Sparkles, Bot, CheckCircle } from "lucide-react";

export default function AdminRevenuePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiPublishing, setAiPublishing] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const handleTriggerAiNews = async () => {
    setAiPublishing(true);
    setAiMessage("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/articles/ai-auto-publish?count_per_topic=3", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setAiMessage(`Амжилттай: ${data.newly_published} шинэ мэдээ татаж нийтлэлээ!`);
        setTimeout(() => setAiMessage(""), 5000);
      }
    } catch (e: any) {
      setAiMessage("Алдаа гарлаа: " + e.message);
    } finally {
      setAiPublishing(false);
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/ads/admin/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Stats татаж чадсангүй:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header />

      <main className="max-w-6xl mx-auto pt-28 pb-20 px-4 sm:px-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#03C75A] text-xs font-bold bg-[#03C75A]/10 px-3 py-1 rounded-full border border-[#03C75A]/20 mb-2">
              <Sparkles size={13} />
              Founder Financial Portal
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Орлого & Зарын Хяналтын Самбар
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              Monger платформын зар сурталчилгааны бодит орлого болон хэмжүүрүүд
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTriggerAiNews}
              disabled={aiPublishing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-extrabold text-xs rounded-xl border border-zinc-700 transition"
            >
              <Bot size={15} />
              {aiPublishing ? "AI Мэдээ татаж байна..." : "🤖 AI Мэдээ Татах"}
            </button>

            <a
              href="/ads/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#03C75A] hover:bg-[#02b350] text-black font-extrabold text-xs rounded-xl transition shadow-lg shadow-[#03C75A]/20"
            >
              + Шинэ зар үүсгэх
            </a>
          </div>
        </div>

        {aiMessage && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle size={15} />
            {aiMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24 text-zinc-500 font-medium">Уншиж байна...</div>
        ) : !stats ? (
          <div className="text-center py-24 text-red-400">Дата ачааллахад алдаа гарлаа.</div>
        ) : (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-zinc-900/70 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 bg-[#03C75A]/10 text-[#03C75A] border border-[#03C75A]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <DollarSign size={26} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Нийт Орлого</span>
                  <span className="text-2xl font-black text-white">
                    {(stats.total_revenue_mnt || 0).toLocaleString()} ₮
                  </span>
                </div>
              </div>

              <div className="bg-zinc-900/70 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Идэвхтэй Зарууд</span>
                  <span className="text-2xl font-black text-white">
                    {stats.active_ads_count}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-900/70 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Eye size={26} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Нийт Үзэлт</span>
                  <span className="text-2xl font-black text-white">
                    {(stats.total_impressions || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-900/70 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MousePointer size={26} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">Нийт Даралт</span>
                  <span className="text-2xl font-black text-white">
                    {(stats.total_clicks || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-zinc-800/80 p-6 overflow-hidden shadow-2xl">
              <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#03C75A]" /> Сүүлийн Захиалгууд
              </h3>

              {stats.recent_ads.length === 0 ? (
                <p className="text-xs text-zinc-500 py-8 text-center">Одоогоор захиалга бүртгэгдээгүй байна.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                        <th className="pb-3">Зарын Гарчиг</th>
                        <th className="pb-3">Төрөл</th>
                        <th className="pb-3">Төлсөн дүн</th>
                        <th className="pb-3">Хугацаа</th>
                        <th className="pb-3">Үзэлт / Даралт</th>
                        <th className="pb-3">Төлөв</th>
                        <th className="pb-3">Утас</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {stats.recent_ads.map((ad: any) => (
                        <tr key={ad.id} className="hover:bg-zinc-800/40 transition">
                          <td className="py-4 font-bold text-white max-w-xs truncate">{ad.title}</td>
                          <td className="py-4 font-mono text-zinc-400 capitalize">{ad.ad_type}</td>
                          <td className="py-4 font-black text-[#03C75A]">
                            {ad.price_paid.toLocaleString()} ₮
                          </td>
                          <td className="py-4 text-zinc-400">{ad.days} хоног</td>
                          <td className="py-4 text-zinc-400">
                            👁️ {ad.impressions || 0} / 👆 {ad.clicks || 0}
                          </td>
                          <td className="py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              ad.status === "active" 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                : "bg-zinc-800 text-zinc-400"
                            }`}>
                              {ad.status === "active" ? "Идэвхтэй" : "Хүлээгдэж буй"}
                            </span>
                          </td>
                          <td className="py-4 text-zinc-400 flex items-center gap-1 font-mono">
                            {ad.contact_phone ? (
                              <>
                                <Phone size={12} className="text-zinc-500" />
                                {ad.contact_phone}
                              </>
                            ) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
