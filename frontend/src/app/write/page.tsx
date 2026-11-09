"use client";

import { getApiUrl } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WriteArticle() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Нэвтэрсэн эсэхийг шалгах
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Ангиллуудыг татах
    fetch(getApiUrl("/api/v1/categories/"))
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id.toString());
      })
      .catch(err => console.error("Ангилал татаж чадсангүй", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(getApiUrl("/api/v1/articles/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          category_id: parseInt(categoryId),
        }),
      });

      if (!res.ok) {
        throw new Error("Мэдээ оруулахад алдаа гарлаа. Та дахин нэвтэрч үзнэ үү.");
      }

      // Амжилттай бол нүүр хуудас руу шилжих
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b p-4 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-extrabold text-[#03C75A] tracking-tighter">Monger</Link>
        <span className="font-bold text-gray-700">Мэдээ оруулах</span>
      </header>

      <main className="max-w-3xl mx-auto py-8 px-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Гарчиг</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Мэдээний гарчиг..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ангилал</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
            >
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Агуулга</label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Энд мэдээгээ бичнэ үү..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
            ></textarea>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-4">
            <Link href="/" className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
              Цуцлах
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-[#03C75A] text-white font-bold rounded-md hover:bg-green-600"
            >
              Нийтлэх
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
