"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const DEMO_SOCIALS = [
  { _id: "soc-1", platform: "github", url: "https://github.com", order: 0 },
  { _id: "soc-2", platform: "linkedin", url: "https://linkedin.com", order: 1 },
  { _id: "soc-3", platform: "twitter", url: "https://x.com", order: 2 },
  { _id: "soc-4", platform: "youtube", url: "https://youtube.com", order: 3 },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  ),
};

export default function Footer() {
  const socials = useQuery(api.socials.list);
  const [year, setYear] = useState<number>(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const items = socials && socials.length > 0 ? socials : DEMO_SOCIALS;
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <footer className="py-14 bg-[#08080c] border-t border-white/5 relative">
      <div className="site-container flex flex-col items-center gap-6 text-center">
        {/* Brand */}
        <div>
          <span className="font-mono text-xl font-bold tracking-tight text-white inline-flex items-center gap-1">
            <span className="text-violet-400">&lt;</span>
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-sans">
              Portfolio
            </span>
            <span className="text-violet-400">/&gt;</span>
          </span>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Dynamic Full-Stack Portfolio · Next.js &amp; Convex · {year}
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3" aria-busy={socials === undefined}>
          {socials === undefined
            ? [1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-10 w-10 rounded-xl" />
              ))
            : sorted.map((s) => (
                <a
                  key={s._id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-sky-600/20 hover:border-sky-500/40 hover:-translate-y-1 transition-all flex items-center justify-center shadow-sm"
                >
                  {SOCIAL_ICONS[s.platform.toLowerCase()] ?? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  )}
                </a>
              ))}
        </div>

        <p className="text-xs text-zinc-400 pt-2 border-t border-white/5 w-full max-w-sm">
          Designed &amp; Engineered for High Performance · All rights reserved
        </p>
      </div>
    </footer>
  );
}
