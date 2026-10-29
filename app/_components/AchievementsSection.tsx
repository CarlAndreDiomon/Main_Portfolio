"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const CAT_ICONS: Record<string, string> = {
  certification: "🏆",
  award: "🥇",
  milestone: "🚀",
};

const DEMO_ACHIEVEMENTS = [
  {
    _id: "ach-1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    description: "Demonstrated expertise in designing highly available, cost-efficient, fault-tolerant cloud infrastructure.",
    category: "certification",
    date: "2024",
    credentialUrl: "https://aws.amazon.com",
    order: 0,
  },
  {
    _id: "ach-2",
    title: "1st Place — Global AI Hackathon",
    issuer: "DevPost & OpenAI",
    description: "Built an autonomous multi-modal agent that accelerates accessibility workflows for web developers.",
    category: "award",
    date: "2023",
    credentialUrl: "https://devpost.com",
    order: 1,
  },
  {
    _id: "ach-3",
    title: "Meta Certified Advanced Frontend Engineer",
    issuer: "Meta / Coursera",
    description: "Specialized in advanced React architecture, state synchronization, and enterprise performance optimizations.",
    category: "certification",
    date: "2023",
    credentialUrl: "https://coursera.org",
    order: 2,
  },
];

export default function AchievementsSection() {
  const achievements = useQuery(api.achievements.list);

  if (achievements === undefined) {
    return (
      <section id="achievements" aria-busy="true" className="py-24 bg-[#0a0a0f] relative">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
              🏆 Honors
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Certifications &amp; <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Awards</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-white/10 bg-[#12121c] p-6">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="w-full space-y-3">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-5 w-4/5 rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = achievements.length > 0 ? achievements : DEMO_ACHIEVEMENTS;
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <section id="achievements" className="py-24 bg-[#0a0a0f] relative border-t border-white/5">
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 tracking-wide">
            🏆 Honors &amp; Credentials
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Certifications &amp; <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Awards</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Recognitions, professional credentials, and major industry milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-6 rounded-2xl bg-[#12121c] border border-white/10 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                {CAT_ICONS[item.category] ?? "✨"}
              </div>

              <div className="flex flex-col flex-grow">
                <span className="inline-flex self-start text-[11px] font-semibold text-violet-400 uppercase tracking-wider mb-1">
                  {item.category}
                </span>

                <h3 className="text-base font-bold text-white mb-1 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-300 font-medium mb-2">
                  {item.issuer}
                </p>

                {item.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5 text-xs">
                  <span className="text-zinc-400 font-mono flex items-center gap-1">
                    <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {item.date}
                  </span>

                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1"
                    >
                      Verify →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
