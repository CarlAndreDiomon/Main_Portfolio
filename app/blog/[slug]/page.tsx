"use client";

import { use, Suspense } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Skeleton from "../../_components/Skeleton";

function BlogSkeleton() {
  return (
    <main aria-busy="true" className="min-h-screen py-28 px-6 bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-12 w-3/4 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <div className="space-y-3" aria-hidden="true">
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </main>
  );
}

function BlogPostContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = use(paramsPromise);
  const post = useQuery(api.blogs.getBySlug, slug ? { slug } : "skip");

  if (post === undefined) {
    return <BlogSkeleton />;
  }

  if (post === null) {
    return (
      <main className="min-h-screen py-32 px-6 bg-[#0a0a0f] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Article Not Found</h1>
          <p className="text-sm text-zinc-400">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/#blog"
            className="button-accent inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            ← Return to Portfolio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <article className="min-h-screen py-28 px-6 bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to all articles
        </Link>

        <header className="mb-10">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-400 pb-6 border-b border-white/10">
            <span>
              {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
            <span>•</span>
            <span>{Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read</span>
          </div>
        </header>

        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full max-h-[440px] rounded-2xl object-cover border border-white/10 mb-10 shadow-2xl shadow-violet-500/5"
          />
        )}

        <div className="text-zinc-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-sans">
          {post.content}
        </div>
      </div>
    </article>
  );
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogPostContent paramsPromise={params} />
    </Suspense>
  );
}
