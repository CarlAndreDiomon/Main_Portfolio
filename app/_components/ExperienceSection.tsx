"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const DEMO_EXPERIENCE = [
  {
    _id: "exp-1",
    role: "Senior Full-Stack Engineer",
    company: "VentureScale Inc.",
    location: "Remote",
    description:
      "Spearheaded core platform modernization to Next.js and serverless microservices. Scaled throughput to 50k+ daily active users while reducing latency by 42%.",
    startDate: "2023",
    endDate: undefined,
    tags: ["Next.js", "TypeScript", "Convex", "TailwindCSS", "AWS"],
    order: 0,
  },
  {
    _id: "exp-2",
    role: "Product Engineer",
    company: "Nexus Labs",
    location: "Singapore / Hybrid",
    description:
      "Architected real-time collaboration canvas and interactive dashboard features. Mentored 4 junior engineers and implemented end-to-end automated testing pipelines.",
    startDate: "2021",
    endDate: "2023",
    tags: ["React", "Node.js", "GraphQL", "Docker", "TailwindCSS"],
    order: 1,
  },
  {
    _id: "exp-3",
    role: "Frontend Developer",
    company: "CloudWave Studio",
    location: "Philippines",
    description:
      "Developed high-converting web applications, bespoke design systems, and responsive landing pages for international clients.",
    startDate: "2019",
    endDate: "2021",
    tags: ["JavaScript", "HTML/CSS", "REST APIs", "Figma"],
    order: 2,
  },
];

export default function ExperienceSection() {
  const experience = useQuery(api.experience.list);

  if (experience === undefined) {
    return (
      <section id="experience" aria-busy="true" className="py-24 bg-[#0d0d14] relative">
        <div className="site-container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
              💼 Career
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Work <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">History</span>
            </h2>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 rounded-2xl border border-white/10 bg-[#12121c] p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-36 rounded-md" />
                </div>
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-[88%] rounded-md" />
                <div className="flex gap-2 border-t border-white/5 pt-4">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-14 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = experience.length > 0 ? experience : DEMO_EXPERIENCE;
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <section id="experience" className="py-24 bg-[#0d0d14] relative border-t border-white/5">
      <div className="site-container max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 tracking-wide">
            💼 Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Work <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Where I have worked, what I have built, and the impact delivered.
          </p>
        </div>

        <div className="relative border-l border-white/10 ml-4 sm:ml-32 space-y-12">
          {sorted.map((exp) => (
            <div key={exp._id} className="relative pl-8 group">
              {/* Timeline Glowing Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0d0d14] border-2 border-violet-500 group-hover:border-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_12px_rgba(139,92,246,0.6)]" />

              {/* Date Column on wider screens */}
              <div className="sm:absolute sm:-left-36 sm:top-1 sm:w-28 sm:text-right font-mono text-xs text-zinc-400 font-semibold mb-2 sm:mb-0">
                <span>{exp.startDate}</span>
                <span className="mx-1">—</span>
                <span className={!exp.endDate ? "text-violet-400 font-bold" : ""}>
                  {exp.endDate ?? "Present"}
                </span>
              </div>

              {/* Card */}
              <div className="rounded-2xl bg-[#12121c] border border-white/10 p-6 sm:p-7 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
                    <span>{exp.company}</span>
                    {exp.location && (
                      <span className="text-zinc-400 text-xs">· {exp.location}</span>
                    )}
                  </div>
                </div>

                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                  {exp.description}
                </p>

                {exp.tags && exp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 text-zinc-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
