"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import { ChevronLeft, Building2, CheckCircle, ShieldCheck } from "lucide-react";

export default function NewPlacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [category, setCategory] = useState("restaurant");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [workingHours, setWorkingHours] = useState("10:00 - 22:00");
  const [imageUrl, setImageUrl] = useState("");
  const [priceLevel, setPriceLevel] = useState("₮₮");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      alert("Газрын нэр болон хаягийг заавал бөглөнө үү!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/places/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          name_en: nameEn || null,
          category,
          description,
          description_en: descriptionEn || null,
          address,
          phone,
          working_hours: workingHours,
          image_url: imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
          price_level: priceLevel
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => {
          router.push(`/places/${data.id}`);
        }, 1500);
      } else {
        alert("Бүртгэхэд алдаа гарлаа.");
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

      <main className="max-w-2xl mx-auto pt-28 pb-20 px-4 sm:px-6">
        <Link
          href="/places"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-[#03C75A] transition mb-6 bg-zinc-900/60 px-4 py-2 rounded-full border border-zinc-800"
        >
          <ChevronLeft size={16} /> Газруудын жагсаалт руу буцах
        </Link>

        <div className="bg-zinc-900/70 backdrop-blur-2xl rounded-3xl border border-zinc-800/80 p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div className="w-12 h-12 bg-[#03C75A]/10 border border-[#03C75A]/20 text-[#03C75A] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Шинэ Бизнес / Газар Бүртгүүлэх
              </h1>
              <p className="text-xs text-zinc-400">
                Monger Place лавлахад үнэ төлбөргүй нэмж, хэрэглэгч жуулчдад хүргэх
              </p>
            </div>
          </div>

          {success ? (
            <div className="py-12 text-center text-[#03C75A] font-bold flex flex-col items-center gap-3">
              <CheckCircle size={48} />
              <p className="text-lg text-white">Амжилттай бүртгэгдлээ! Шилжиж байна...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Газрын Монгол нэр *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Жишээ: Modern Nomads"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Англи нэр (Жуулчдад зориулсан)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Modern Nomads Restaurant"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Ангилал *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition font-medium"
                  >
                    <option value="restaurant">🍽️ Ресторан (Restaurant)</option>
                    <option value="cafe">☕ Кофе шоп (Cafe)</option>
                    <option value="hotel">🏨 Зочид буудал (Hotel)</option>
                    <option value="attraction">🏛️ Үзвэр & Соёл (Attraction)</option>
                    <option value="nightlife">🍸 Шөнийн клуб, Лоунж (Nightlife)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Үнийн түвшин
                  </label>
                  <select
                    value={priceLevel}
                    onChange={(e) => setPriceLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition font-medium"
                  >
                    <option value="₮">₮ - Хямд төсөр</option>
                    <option value="₮₮">₮₮ - Дундаж</option>
                    <option value="₮₮₮">₮₮₮ - Дээд зэрэглэл</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Хаяг, байршил *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Жишээ: Сүхбаатар дүүрэг, Их дэлгүүрийн баруун талд"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Утасны дугаар
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="7711-xxxx, 9911-xxxx"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Ажиллах цагийн хуваарь
                  </label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="09:00 - 22:00"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  initialUrl={imageUrl}
                  onUploadSuccess={(url) => setImageUrl(url)}
                  label="Газрын ковер зураг (Утас эсвэл Компьютерээс шууд сонгох)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Монгол тайлбар
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Үйлчилгээ, хоолны онцлог, орчны тухай товч тайлбар..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Англи тайлбар (Жуулчдад зориулсан)
                </label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="English summary for foreign tourists..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#03C75A] hover:bg-[#02b350] text-black font-black text-sm rounded-2xl transition shadow-lg shadow-[#03C75A]/25"
                >
                  {loading ? "Бүртгэж байна..." : "Газрыг Бүртгүүлэх"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
