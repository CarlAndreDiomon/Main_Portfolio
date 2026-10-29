"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const DEMO_TESTIMONIALS = [
  {
    _id: "demo-1",
    name: "Alex Rivera",
    role: "Engineering Director",
    company: "Apex Dynamics",
    content:
      "One of the fastest and most thorough engineers I've worked with. Shipped our core real-time analytics module in record time with unmatched code quality and attention to UX.",
    avatarUrl: "",
    order: 0,
    visible: true,
  },
  {
    _id: "demo-2",
    name: "Elena Rostova",
    role: "Product Lead",
    company: "HyperScale Lab",
    content:
      "A rare full-stack builder who understands both high-throughput distributed systems and pixel-perfect design. Highly recommended for any ambitious venture.",
    avatarUrl: "",
    order: 1,
    visible: true,
  },
  {
    _id: "demo-3",
    name: "Marcus Chen",
    role: "Founder & CEO",
    company: "VentureCraft",
    content:
      "Transformed our prototype into a scalable production platform that handled our launch traffic seamlessly. Communication and execution are top-tier.",
    avatarUrl: "",
    order: 2,
    visible: true,
  },
];

export default function TestimonialsSection() {
  const testimonials = useQuery(api.testimonials.list);

  if (testimonials === undefined) {
    return (
      <section id="testimonials" aria-busy="true" className="py-24 bg-[#0d0d14] relative">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
              💬 Endorsements
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              What People <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Say</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-5 rounded-2xl border border-white/10 bg-[#12121c] p-7">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-36 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = testimonials.length > 0 ? testimonials : DEMO_TESTIMONIALS;
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <section id="testimonials" className="py-24 bg-[#0d0d14] relative border-t border-white/5">
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 tracking-wide">
            💬 Recommendations
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Client &amp; Peer <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Reviews</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Feedback and testimonials from engineering leads, founders, and cross-functional partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((t) => (
            <div
              key={t._id}
              className="group relative flex flex-col justify-between p-7 rounded-2xl bg-[#12121c] border border-white/10 hover:border-violet-500/40 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-violet-500/5"
            >
              {/* Subtle top accent gradient on hover */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="text-4xl leading-none text-violet-400/30 font-serif mb-3 select-none">
                “
              </div>

              <p className="text-zinc-300 italic text-sm sm:text-base leading-relaxed mb-6 flex-grow">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-3.5 pt-4 border-t border-white/5 mt-auto">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-violet-500/30 flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    {t.name.charAt(0)}
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">
                    {t.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {t.role} · {t.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
