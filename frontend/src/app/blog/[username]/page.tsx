import Link from 'next/link';
import Header from '@/components/Header';
import { getApiUrl } from '@/lib/api';
import { DEFAULT_BLOGS } from '@/lib/fallbackData';
import { Eye, Clock, User, Sparkles } from 'lucide-react';

export default async function UserBlog({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  let blog = null;
  let posts: any[] = [];

  try {
    const blogRes = await fetch(getApiUrl(`/api/v1/blogs/${username}`), { cache: 'no-store' });
    if (blogRes.ok) blog = await blogRes.json();
  } catch (e) {
    console.warn("Blog fallback mode:", e);
  }

  try {
    const postsRes = await fetch(getApiUrl(`/api/v1/blogs/${username}/posts`), { cache: 'no-store' });
    if (postsRes.ok) posts = await postsRes.json();
  } catch (e) {
    console.warn("Posts fallback mode:", e);
  }

  if (!blog) {
    const matched = DEFAULT_BLOGS.find(b => b.blog.user.username === username);
    blog = {
      title: matched ? matched.blog.title : `${username} блог`,
      description: "Monger платформын албан ёсны зохиогч, бүтээгч.",
      user: { username }
    };
    if (posts.length === 0) {
      posts = DEFAULT_BLOGS.filter(b => !matched || b.blog.user.username === username);
    }
  }

  return (
    <div className="min-h-screen bg-[#070b09] text-zinc-100 font-sans selection:bg-[#03C75A] selection:text-black">
      <Header />
      
      {/* Blog Cover in Dark Obsidian */}
      <section className="relative h-[280px] bg-gradient-to-b from-[#011a0c] via-[#042813] to-[#070b09] flex flex-col items-center justify-center pt-16 text-center px-4 overflow-hidden border-b border-zinc-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#03c75a]/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800 text-[#03C75A] text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles size={12} /> Monger Creator Studio
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">
            {blog.title}
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">{blog.description}</p>
        </div>

        <div className="absolute bottom-[-20px] bg-zinc-900 border border-zinc-700 text-[#03C75A] font-extrabold text-xs px-5 py-2 rounded-full shadow-2xl flex items-center gap-2">
          <User size={14} />
          @{username}
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto py-16 px-4 sm:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-xl font-black text-white">Нийтлэлүүд ({posts.length})</h2>
          </div>

          {posts.length === 0 ? (
            <div className="bg-zinc-900/50 backdrop-blur-xl p-12 text-center rounded-3xl border border-zinc-800">
              <p className="text-zinc-500 text-sm">Одоогоор нийтлэл ороогүй байна.</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <article key={post.id} className="bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-zinc-800/80 hover:border-[#03C75A]/50 transition-all duration-300 shadow-xl">
                <h3 className="text-xl font-extrabold text-white mb-3 hover:text-[#03C75A] transition">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(post.created_at || Date.now()).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 480}</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
