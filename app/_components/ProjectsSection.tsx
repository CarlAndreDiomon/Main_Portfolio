"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const DEMO_PROJECTS = [
  {
    _id: "demo-p1",
    title: "AI-Powered Distributed Analytics Engine",
    description: "High-throughput real-time telemetry processing platform built with Next.js, Rust microservices, and Kafka streaming pipelines.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Kafka", "PostgreSQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    order: 0,
    status: "completed",
  },
  {
    _id: "demo-p2",
    title: "Cloud Native Developer Observability Suite",
    description: "Full-stack monitoring dashboard with distributed tracing, live memory profiling, and automated alerts for serverless architectures.",
    imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop",
    tags: ["React", "Convex", "TailwindCSS", "GraphQL", "Docker"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    order: 1,
    status: "completed",
  },
  {
    _id: "demo-p3",
    title: "Neural Canvas - Generative Design Studio",
    description: "Collaborative vector graphics playground integrated with diffusion models and real-time multiplayer WebRTC rooms.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    tags: ["Next.js", "WebSockets", "TailwindCSS", "Three.js", "PyTorch"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    order: 2,
    status: "in-progress",
  },
];

const STATUS_BADGES: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "in-progress": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  archived: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

export default function ProjectsSection() {
  const projects = useQuery(api.projects.list);

  if (projects === undefined) {
    return (
      <section id="projects" aria-busy="true" className="py-24 bg-[#0d0d14] relative">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Featured <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121c]">
                <Skeleton className="h-48 sm:h-52 w-full" />
                <div className="space-y-4 p-6">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-14 rounded-md" />
                  </div>
                  <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = projects.length > 0 ? projects : DEMO_PROJECTS;
  const sorted = [...items].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.order - b.order;
  });

  return (
    <section id="projects" className="py-24 bg-[#0d0d14] relative border-t border-white/5">
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 tracking-wide">
            💻 Portfolio
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Featured <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            A curated collection of scalable web applications, real-time systems, and creative tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((p) => (
            <article
              key={p._id}
              className={`group relative flex flex-col rounded-2xl bg-[#12121c] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10 overflow-hidden ${
                p.featured
                  ? "border-violet-500/30 hover:border-violet-400/60"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {p.featured && (
                <div className="absolute top-3.5 right-3.5 z-10 px-3 py-1 rounded-full text-xs font-semibold bg-violet-600/80 text-white border border-violet-400/40 backdrop-blur-md shadow-md flex items-center gap-1.5">
                  ⭐ Featured
                </div>
              )}

              {/* Cover Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121c] via-transparent to-transparent opacity-80" />
              </div>

              {/* Content Body */}
              <div className="flex flex-col flex-grow p-6">
                <span
                  className={`inline-flex self-start px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border mb-3 ${
                    STATUS_BADGES[p.status] ?? STATUS_BADGES.completed
                  }`}
                >
                  {p.status}
                </span>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {p.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {p.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 text-zinc-300 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/10 mt-auto">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-accent inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      Code
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
