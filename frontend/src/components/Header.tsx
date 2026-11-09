"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, User, Edit3, LogOut, Megaphone, DollarSign, MapPin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ q = "" }: { q?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetch("http://127.0.0.1:8000/api/v1/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.role) setUserRole(data.role);
      })
      .catch(err => console.error(err));
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        <div className="flex justify-between items-center gap-4">
          
          {/* Logo with Emerald Glow */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#03c75a] to-emerald-400 flex items-center justify-center text-black font-black text-lg shadow-md shadow-[#03c75a]/30 group-hover:scale-105 transition">
              M
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-[#03C75A] transition">
              Monger
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form method="GET" action="/" className="w-full relative group">
              <input 
                type="text" 
                name="q" 
                defaultValue={q}
                placeholder="Мэдээ, нийтлэл, газар хайх..." 
                className="w-full pl-4 pr-10 py-2 bg-zinc-900/90 border border-zinc-800 rounded-full text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#03C75A] focus:ring-1 focus:ring-[#03C75A] transition"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#03C75A] transition">
                <Search size={15} />
              </button>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link 
              href="/places" 
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-800 transition"
            >
              <MapPin size={13} className="text-[#03C75A]" />
              Газрууд
            </Link>

            <Link 
              href="/ads/create" 
              className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/20 transition"
            >
              <Megaphone size={13} />
              Зар тавих
            </Link>

            {userRole === "admin" && (
              <Link 
                href="/admin/revenue" 
                className="flex items-center gap-1.5 text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 px-3.5 py-1.5 rounded-full border border-purple-500/20 transition"
              >
                <DollarSign size={13} />
                Орлого
              </Link>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                {["journalist", "admin"].includes(userRole) ? (
                  <Link href="/write" className="flex items-center gap-1.5 text-xs font-extrabold px-4 py-1.5 rounded-full bg-[#03C75A] text-black hover:bg-[#02b350] transition shadow-md shadow-[#03C75A]/20">
                    <Edit3 size={13} /> Мэдээ
                  </Link>
                ) : (
                  <Link href="/write/blog" className="flex items-center gap-1.5 text-xs font-extrabold px-4 py-1.5 rounded-full bg-[#03C75A] text-black hover:bg-[#02b350] transition shadow-md shadow-[#03C75A]/20">
                    <User size={13} /> Блог
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  title="Гарах"
                  className="p-1.5 rounded-full text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-1.5 text-xs font-extrabold px-4 py-1.5 rounded-full bg-[#03C75A] text-black hover:bg-[#02b350] transition shadow-md shadow-[#03C75A]/20"
              >
                <User size={13} />
                Нэвтрэх
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-5 shadow-2xl"
          >
            <form method="GET" action="/" className="relative mb-4">
              <input 
                type="text" 
                name="q" 
                defaultValue={q}
                placeholder="Мэдээ, газар хайх..." 
                className="w-full pl-4 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#03C75A]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Search size={16} />
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <Link 
                href="/places" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-200"
              >
                <span className="flex items-center gap-2"><MapPin size={16} className="text-[#03C75A]" /> Газрууд (Place)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Шинэ</span>
              </Link>

              <Link 
                href="/ads/create" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300"
              >
                <Megaphone size={16} /> Зар байршуулах (15,000₮)
              </Link>

              {userRole === "admin" && (
                <Link 
                  href="/admin/revenue" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300"
                >
                  <DollarSign size={16} /> Орлого & Хяналт
                </Link>
              )}

              {isLoggedIn ? (
                <>
                  {["journalist", "admin"].includes(userRole) ? (
                    <Link 
                      href="/write" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#03C75A] text-black font-extrabold text-xs"
                    >
                      <Edit3 size={16} /> Шинэ мэдээ оруулах
                    </Link>
                  ) : (
                    <Link 
                      href="/write/blog" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#03C75A] text-black font-extrabold text-xs"
                    >
                      <User size={16} /> Миний Блог
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 font-bold text-xs border border-red-500/20 mt-1"
                  >
                    <LogOut size={16} /> Гарах
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#03C75A] text-black font-extrabold text-xs"
                >
                  <User size={16} /> Нэвтрэх
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
