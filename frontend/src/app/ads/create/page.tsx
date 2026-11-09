"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getApiUrl } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import { Megaphone, CheckCircle, ShieldCheck, Sparkles, ArrowRight, QrCode, ChevronLeft } from "lucide-react";

const AD_TYPES = [
  {
    id: "home_banner",
    title: "Нүүр хуудасны Тэргүүн Баннер",
    price: 15000,
    desc: "Monger-ийн бүх зочдод хамгийн түрүүнд харагдах өндөр үр дүнтэй онцлох байршил.",
    badge: "Хамгийн их хандалттай"
  },
  {
    id: "search_top",
    title: "Хайлтын Ивээн Тэтгэсэн Илэрц",
    price: 10000,
    desc: "Хэрэглэгчид тодорхой түлхүүр үгээр хайхад хамгийн дээр байрших зорилтот зар.",
    badge: "Өндөр хувиргалттай"
  },
  {
    id: "sidebar",
    title: "Баруун баганын Онцлох Зар",
    price: 7000,
    desc: "Цаг агаар, трэнд хайлтын хажууд байрших байнгын харагдацтай баннер.",
    badge: "Хэмнэлттэй"
  }
];

export default function CreateAdPage() {
  const [selectedType, setSelectedType] = useState("home_banner");
  const [days, setDays] = useState(3);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentRate = AD_TYPES.find(t => t.id === selectedType)?.price || 15000;
  const totalPrice = currentRate * days;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetUrl) {
      alert("Зарын гарчиг болон очих линкийг заавал бөглөнө үү!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/v1/ads/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          image_url: imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
          target_url: targetUrl,
          ad_type: selectedType,
          target_keyword: targetKeyword || null,
          days: Number(days),
          contact_phone: contactPhone
        })
      });

      if (!res.ok) throw new Error("Алдаа гарлаа");
      const data = await res.json();
      setInvoice(data);
    } catch (err: any) {
      alert("Зар үүсгэхэд алдаа гарлаа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!invoice?.ad?.id) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/v1/ads/${invoice.ad.id}/pay-confirm`), {
        method: "POST"
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert("Төлбөр шалгахад алдаа гарлаа.");
      }
    } catch (e: any) {
      alert("Сүлжээний алдаа: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header />

      <main className="max-w-4xl mx-auto pt-28 pb-20 px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#03C75A]/10 border border-[#03C75A]/20 text-[#03C75A] font-extrabold text-xs px-4 py-1.5 rounded-full mb-3 shadow-inner">
            <Sparkles size={14} /> Monger Ads Self-Serve Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Бизнесээ Олон Нийтэд Хүргэх
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
            QPay-ээр хэдхэн хоромд төлбөрөө хийж, Monger-ийн өдөр тутмын идэвхтэй уншигчдад бүтээгдэхүүн, үйлчилгээгээ танилцуул.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-zinc-900/80 backdrop-blur-2xl p-10 rounded-3xl border border-[#03C75A]/30 text-center max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 bg-[#03C75A]/20 text-[#03C75A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#03C75A]/40">
              <CheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Төлбөр Амжилттай Баталгаажлаа!</h2>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
              Таны зар <strong>"{invoice?.ad?.title}"</strong> системд идэвхжсэн бөгөөд одоо шууд Monger-ийн уншигчдад харагдаж байна.
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full py-3 bg-[#03C75A] hover:bg-[#02b350] text-black font-extrabold rounded-xl transition shadow-lg shadow-[#03C75A]/25 text-xs"
              >
                Нүүр хуудас руу очиж харах
              </Link>
              <button
                onClick={() => {
                  setInvoice(null);
                  setIsSuccess(false);
                  setTitle("");
                }}
                className="block w-full py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition text-xs"
              >
                Дахин шинэ зар үүсгэх
              </button>
            </div>
          </div>
        ) : invoice ? (
          /* QPay Payment Screen in Frosted Glass */
          <div className="bg-zinc-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-zinc-800 max-w-lg mx-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Нэхэмжлэх</span>
                <h3 className="font-bold text-sm text-zinc-200">{invoice.invoice.invoice_id}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Нийт дүн</span>
                <h3 className="font-black text-2xl text-[#03C75A]">
                  {invoice.invoice.amount.toLocaleString()} ₮
                </h3>
              </div>
            </div>

            <div className="bg-zinc-950/80 p-6 rounded-2xl border border-zinc-800 text-center mb-6">
              <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto shadow-inner flex flex-col items-center justify-center mb-3">
                <QrCode size={130} className="text-zinc-900" />
                <span className="text-[10px] font-bold text-zinc-600 mt-1">QPay QR код уншуулах</span>
              </div>
              <p className="text-xs text-zinc-400">
                Та дурын банкны аппликейшнээр дээрх QR кодыг уншуулан төлбөрөө хийнэ үү.
              </p>
            </div>

            {/* Bank Logos */}
            <div className="mb-6">
              <span className="text-xs font-bold text-zinc-400 block mb-2">Дэмжигдэх банкууд:</span>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {invoice.invoice.banks.map((b: any) => (
                  <div key={b.code} className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-xl block">{b.logo}</span>
                    <span className="truncate block font-semibold text-[10px] text-zinc-300 mt-1">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full py-4 bg-[#03C75A] hover:bg-[#02b350] text-black font-black text-sm rounded-2xl transition shadow-lg shadow-[#03C75A]/25 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              {loading ? "Шалгаж байна..." : "Төлбөр төлөгдсөн, Шалгах"}
            </button>
            <p className="text-[11px] text-center text-zinc-500 mt-3">
              Төлбөр төлмөгц таны зар автоматаар шууд идэвхжинэ.
            </p>
          </div>
        ) : (
          /* Ad Creation Form */
          <form onSubmit={handleSubmit} className="bg-zinc-900/70 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-zinc-800/80 space-y-8 shadow-2xl">
            {/* Step 1: Select Type */}
            <div>
              <label className="block text-sm font-black text-white mb-3">
                1. Зар байршуулах төрлөө сонгоно уу
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AD_TYPES.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                      selectedType === t.id
                        ? "border-[#03C75A] bg-[#03C75A]/10 shadow-lg shadow-[#03C75A]/10 scale-102"
                        : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-[#03C75A]">
                        {t.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{t.title}</h4>
                    <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{t.desc}</p>
                    <div className="text-[#03C75A] font-black text-lg">
                      {t.price.toLocaleString()} ₮ <span className="text-xs font-normal text-zinc-500">/өдөр</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Details */}
            <div className="space-y-4">
              <label className="block text-sm font-black text-white">
                2. Зарын мэдээллээ оруулна уу
              </label>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Зарын гарчиг *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Жишээ: Шинэ оффисын тавилга 20% хямдарлаа"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Богино тайлбар
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Жишээ: Чанартай, баталгаат тавилгыг үйлдвэрийн үнээр нийлүүлж байна."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Очих веб линк эсвэл Фэйсбүүк хуудас *
                </label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://facebook.com/mybusiness"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                />
              </div>

              <div>
                <ImageUpload
                  initialUrl={imageUrl}
                  onUploadSuccess={(url) => setImageUrl(url)}
                  label="Баннер сурталчилгааны зураг (Утас эсвэл Компьютерээс)"
                />
              </div>

              {selectedType === "search_top" && (
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Зорилтот хайлтын түлхүүр үг (Түлхүүр үгээр хайхад гарч ирнэ)
                  </label>
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Жишээ: сургалт, машин, тавилга, байр"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Холбоо барих утасны дугаар
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="9911..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Байрших хугацаа (Хоногоор)
                  </label>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                  >
                    <option value={1}>1 хоног</option>
                    <option value={3}>3 хоног (Зөвлөмж)</option>
                    <option value={7}>7 хоног (1 долоо хоног)</option>
                    <option value={14}>14 хоног (2 долоо хоног)</option>
                    <option value={30}>30 хоног (1 сар)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price Summary & Submit */}
            <div className="pt-6 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-500 font-bold block">Нийт төлөх дүн:</span>
                <span className="text-3xl font-black text-[#03C75A]">
                  {totalPrice.toLocaleString()} ₮
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  ({currentRate.toLocaleString()} ₮ × {days} хоног)
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-[#03C75A] hover:bg-[#02b350] text-black font-black text-sm rounded-2xl transition shadow-lg shadow-[#03C75A]/25 flex items-center justify-center gap-2"
              >
                {loading ? "Бэлтгэж байна..." : "QPay-ээр Төлөх & Идэвхжүүлэх"}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
