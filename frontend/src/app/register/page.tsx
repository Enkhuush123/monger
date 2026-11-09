"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/v1/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Бүртгэл амжилтгүй боллоо");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b09] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-zinc-100 relative overflow-hidden selection:bg-[#03C75A] selection:text-black">
      
      {/* Decorative ambient glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#03c75a]/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#03c75a] to-emerald-400 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#03c75a]/30 group-hover:scale-105 transition">
            M
          </span>
          <span className="text-3xl font-black text-white tracking-tighter">Monger</span>
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-white">Шинэ Бүртгэл Үүсгэх</h2>
        <p className="mt-2 text-xs text-zinc-400">
          Эсвэл{" "}
          <Link href="/login" className="font-bold text-[#03C75A] hover:underline">
            нэвтрэх
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-zinc-900/70 backdrop-blur-2xl py-8 px-6 shadow-2xl rounded-3xl border border-zinc-800/80 sm:px-10">
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                И-мэйл хаяг
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#03C75A] transition"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                Хэрэглэгчийн нэр
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#03C75A] transition"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                Нууц үг
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#03C75A] transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 font-medium">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#03C75A] hover:bg-[#02b350] text-black font-black text-sm rounded-xl transition shadow-lg shadow-[#03C75A]/25"
              >
                {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition">
              <ArrowLeft size={14} /> Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
