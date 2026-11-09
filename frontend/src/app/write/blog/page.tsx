"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getApiUrl } from "@/lib/api";
import { Sparkles, Edit3, CheckCircle, ArrowRight } from "lucide-react";

export default function WriteBlog() {
  const router = useRouter();
  const [hasBlog, setHasBlog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Create Blog state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  
  // Create Post state
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Check user and blog status
    fetch(getApiUrl("/api/v1/users/me"), {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(userData => {
      setUsername(userData.username);
      return fetch(getApiUrl(`/api/v1/blogs/${userData.username}`));
    })
    .then(res => {
      if (res.ok) setHasBlog(true);
      else setHasBlog(false);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(getApiUrl("/api/v1/blogs/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: blogTitle, description: blogDesc }),
      });

      if (!res.ok) throw new Error("Блог нээхэд алдаа гарлаа.");
      setHasBlog(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(getApiUrl("/api/v1/blogs/posts/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: postTitle, content: postContent }),
      });

      if (!res.ok) throw new Error("Нийтлэл оруулахад алдаа гарлаа.");
      router.push(`/blog/${username}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#070b09] pt-32 text-center text-zinc-500 font-medium">Уншиж байна...</div>;

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header />
      
      <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
        {!hasBlog ? (
          <div className="bg-zinc-900/70 backdrop-blur-2xl p-8 rounded-3xl border border-zinc-800 shadow-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#03C75A]/10 text-[#03C75A] text-xs font-bold px-3 py-1 rounded-full border border-[#03C75A]/20 mb-3">
              <Sparkles size={13} />
              Блогчин Болох
            </div>
            <h2 className="text-3xl font-black mb-3 text-white">Миний Блог нээх</h2>
            <p className="text-zinc-400 text-xs mb-8 leading-relaxed">
              Танд одоогоор өөрийн гэсэн блог байхгүй байна. Өөрийн блогоо үүсгээд бусадтай үзэл бодол, нийтлэлүүдээ чөлөөтэй хуваалцаарай!
            </p>
            
            <form onSubmit={handleCreateBlog} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Блогийн нэр *</label>
                <input 
                  required 
                  type="text" 
                  value={blogTitle} 
                  onChange={(e) => setBlogTitle(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition" 
                  placeholder="Жишээ: Батын Технологи Тэмдэглэл" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Товч тайлбар (Description)</label>
                <input 
                  type="text" 
                  value={blogDesc} 
                  onChange={(e) => setBlogDesc(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition" 
                  placeholder="Жишээ: Програмчлал, стартап, амьдралын сонин хачин..." 
                />
              </div>
              {error && <div className="text-red-400 text-xs">{error}</div>}
              <button 
                type="submit" 
                className="w-full py-3.5 bg-[#03C75A] hover:bg-[#02b350] text-black font-black text-sm rounded-xl transition shadow-lg shadow-[#03C75A]/25"
              >
                Блог Үүсгэх
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-zinc-900/70 backdrop-blur-2xl p-8 rounded-3xl border border-zinc-800 shadow-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#03C75A]/10 text-[#03C75A] text-xs font-bold px-3 py-1 rounded-full border border-[#03C75A]/20 mb-3">
              <Edit3 size={13} />
              Нийтлэлч
            </div>
            <h2 className="text-3xl font-black mb-6 text-white">Шинэ Нийтлэл Оруулах</h2>
            <form onSubmit={handleCreatePost} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Нийтлэлийн гарчиг *</label>
                <input 
                  required 
                  type="text" 
                  value={postTitle} 
                  onChange={(e) => setPostTitle(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition" 
                  placeholder="Жишээ: Шинэ технологийн чиг хандлага" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Нийтлэлийн агуулга *</label>
                <textarea 
                  required 
                  rows={8} 
                  value={postContent} 
                  onChange={(e) => setPostContent(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#03C75A] transition leading-relaxed" 
                  placeholder="Агуулгаа энд бичнэ үү..."
                />
              </div>
              {error && <div className="text-red-400 text-xs">{error}</div>}
              <button 
                type="submit" 
                className="w-full py-3.5 bg-[#03C75A] hover:bg-[#02b350] text-black font-black text-sm rounded-xl transition shadow-lg shadow-[#03C75A]/25"
              >
                Нийтлэх →
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
