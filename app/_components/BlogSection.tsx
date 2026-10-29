"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const DEMO_POSTS = [
  {
    _id: "demo-b1",
    title: "Building Real-Time Dynamic Portfolios with Next.js 16 & Convex",
    slug: "building-real-time-dynamic-portfolios-nextjs-convex",
    excerpt:
      "A deep dive into zero-maintenance web architectures: why coupling reactive cloud databases with Next.js App Router eliminates redeployment cycles.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    tags: ["Next.js", "Convex", "Architecture"],
    publishedAt: "2024-10-15T00:00:00.000Z",
    createdAt: "2024-10-15T00:00:00.000Z",
    published: true,
  },
  {
    _id: "demo-b2",
    title: "Tailwind CSS v4 & Turbopack: Modern Frontend Speed",
    slug: "tailwind-css-v4-turbopack-modern-speed",
    excerpt:
      "Exploring the high-performance CSS engine of Tailwind v4, cascade layers, CSS variables, and seamless Turbopack compilation.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    tags: ["TailwindCSS", "CSS", "Performance"],
    publishedAt: "2024-09-28T00:00:00.000Z",
    createdAt: "2024-09-28T00:00:00.000Z",
    published: true,
  },
  {
    _id: "demo-b3",
    title: "Mastering Optimistic Updates and Offline Synchronization",
    slug: "mastering-optimistic-updates-offline-sync",
    excerpt:
      "Techniques for creating instant UI feedback and handling network partitions in enterprise-grade distributed web applications.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    tags: ["React", "State Management", "UX"],
    publishedAt: "2024-08-12T00:00:00.000Z",
    createdAt: "2024-08-12T00:00:00.000Z",
    published: true,
  },
];

export default function BlogSection() {
  const posts = useQuery(api.blogs.listPublished);

  if (posts === undefined) {
    return (
      <section id="blog" aria-busy="true" className="py-24 bg-[#0a0a0f] relative">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
              📝 Articles
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Latest <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Posts</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121c]">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-4 p-6">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-20 rounded" />
                  </div>
                  <Skeleton className="h-6 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-[88%] rounded-md" />
                  <div className="flex justify-between border-t border-white/5 pt-4">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = posts.length > 0 ? posts : DEMO_POSTS;
  const sorted = [...items].sort((a, b) => {
    const dateA = a.publishedAt ?? a.createdAt;
    const dateB = b.publishedAt ?? b.createdAt;
    return dateB.localeCompare(dateA);
  });

  return (
    <section id="blog" className="py-24 bg-[#0a0a0f] relative border-t border-white/5">
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 tracking-wide">
            📝 Publications
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Latest <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Articles</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Thoughts, technical tutorials, and deep architectural insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((post) => (
            <article
              key={post._id}
              className="group flex flex-col rounded-2xl bg-[#12121c] border border-white/10 hover:border-violet-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden"
            >
              {post.coverImageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12121c] via-transparent to-transparent opacity-80" />
                </div>
              )}

              <div className="flex flex-col flex-grow p-6">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-zinc-400">
                  <span>
                    {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold text-violet-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    Read article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
