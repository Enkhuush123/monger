import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Fetch specific article from backend
  const res = await fetch(`http://127.0.0.1:8000/api/v1/articles/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    notFound();
  }

  const article = await res.json();

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-[#03C75A] text-white p-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-3xl font-extrabold tracking-tighter">Monger</Link>
          <div className="flex gap-4">
            <Link href="/" className="font-bold text-sm bg-green-700 px-4 py-2 rounded-md hover:bg-green-800 transition">
              Буцах
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6 border-b pb-4">
            <span className="text-sm font-bold text-[#03C75A] uppercase tracking-wider block mb-2">
              {article.category?.name || "Ангилалгүй"}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <span>Сэтгүүлч: {article.author?.username || "Мэдэгдэхгүй"}</span>
              <span>•</span>
              <span>{new Date(article.created_at).toLocaleString()}</span>
              <span>•</span>
              <span>👁 {article.views} удаа уншсан</span>
            </div>
          </div>
          
          <div className="prose max-w-none text-gray-800 leading-loose text-lg whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      </main>
    </div>
  );
}
