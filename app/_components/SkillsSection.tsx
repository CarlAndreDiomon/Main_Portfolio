"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools"];

const DEMO_SKILLS = [
  { _id: "s1", name: "React / Next.js 15+", category: "Frontend", level: 95, order: 0 },
  { _id: "s2", name: "TypeScript", category: "Frontend", level: 92, order: 1 },
  { _id: "s3", name: "Tailwind CSS", category: "Frontend", level: 96, order: 2 },
  { _id: "s4", name: "Node.js / Express", category: "Backend", level: 90, order: 0 },
  { _id: "s5", name: "Convex / GraphQL", category: "Backend", level: 88, order: 1 },
  { _id: "s6", name: "Python / FastAPI", category: "Backend", level: 82, order: 2 },
  { _id: "s7", name: "PostgreSQL & Prisma", category: "Database", level: 86, order: 0 },
  { _id: "s8", name: "Redis & Vector DBs", category: "Database", level: 80, order: 1 },
  { _id: "s9", name: "Docker & Kubernetes", category: "DevOps", level: 78, order: 0 },
  { _id: "s10", name: "CI/CD & Cloudflare", category: "DevOps", level: 85, order: 1 },
];

export default function SkillsSection() {
  const skills = useQuery(api.skills.list);

  if (skills === undefined) {
    return (
      <section id="skills" aria-busy="true" className="py-24 bg-[#0a0a0f] relative">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
              ⚡ Skills
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Tech <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Stack</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-6 rounded-2xl border border-white/10 bg-[#12121c] p-7 sm:p-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <Skeleton className="h-6 w-32 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                {[1, 2, 3].map((row) => (
                  <div key={row} className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-4 w-10 rounded-md" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = skills.length > 0 ? skills : DEMO_SKILLS;
  const categoriesPresent = [...new Set(items.map((s) => s.category))];

  return (
    <section id="skills" className="py-24 bg-[#0a0a0f] relative border-t border-white/5">
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 tracking-wide">
            ⚡ Tech Stack
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Skills &amp; <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Expertise</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Languages, frameworks, and modern tools I leverage to build mission-critical products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesPresent.map((category) => {
            const catSkills = items
              .filter((s) => s.category === category)
              .sort((a, b) => a.order - b.order);

            return (
              <div
                key={category}
                className="rounded-2xl bg-[#12121c] border border-white/10 p-7 sm:p-8 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {category}
                    </h3>
                    <span className="text-xs font-mono text-violet-400 font-medium px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20">
                      {catSkills.length} skills
                    </span>
                  </div>

                  <div className="space-y-4.5">
                    {catSkills.map((skill) => (
                      <div key={skill._id}>
                        <div className="flex items-center justify-between text-xs font-medium mb-2">
                          <span className="flex items-center gap-2 text-zinc-200 font-medium">
                            {"icon" in skill && typeof skill.icon === "string" && skill.icon && (
                              <span aria-hidden="true">{skill.icon}</span>
                            )}
                            {skill.name}
                          </span>
                          <span className="font-mono text-zinc-400">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
