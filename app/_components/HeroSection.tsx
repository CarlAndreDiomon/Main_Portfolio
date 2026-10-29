"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Skeleton from "./Skeleton";

const PLACEHOLDER = {
  name: "Your Name",
  title: "Product Engineer",
  tagline: "I build things that matter.",
  bio: "Passionate about crafting seamless digital experiences — from system architecture to pixel-perfect UI. I turn ideas into products that scale.",
  location: "Philippines",
  email: "hello@example.com",
  avatarUrl: "",
  resumeUrl: "",
};

export default function HeroSection() {
  const hero = useQuery(api.hero.get);
  const isLoading = hero === undefined;
  const data = hero ?? PLACEHOLDER;

  return (
    <section id="hero" aria-busy={isLoading} className="relative flex min-h-[78vh] items-center overflow-hidden bg-[#0a0a0f] px-0 pb-16 pt-28 sm:min-h-[92vh] sm:pb-24 sm:pt-32">
      {/* Background glowing gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="site-container relative z-10">
        <div className="max-w-3xl">
          {/* Status badge */}
          <div className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs font-medium tracking-wide text-violet-300 shadow-sm backdrop-blur-md sm:mb-8 sm:px-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for new opportunities
          </div>

          {/* Main heading */}
          <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {isLoading ? (
              <>
                <span className="text-white">Hi, I&apos;m </span>
                <Skeleton className="inline-block h-10 w-48 max-w-[55vw] rounded-lg align-middle sm:h-16 sm:w-72 lg:h-20" />
              </>
            ) : (
              <>
                <span className="text-white">Hi, I&apos;m </span>
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {data.name}
                </span>
              </>
            )}
          </h1>

          {/* Title row */}
          <div className="mb-5 flex items-center gap-2 text-lg font-mono text-zinc-300 sm:mb-6 sm:text-2xl">
            {isLoading ? (
              <Skeleton className="h-6 w-56 max-w-[70vw] rounded-md sm:h-8 sm:w-72" />
            ) : (
              <>
                <span className="text-violet-400 font-semibold">&lt;</span>
                <span className="font-medium text-zinc-200">{data.title}</span>
                <span className="text-violet-400 font-semibold">/&gt;</span>
              </>
            )}
          </div>

          {/* Tagline */}
          {isLoading ? (
            <Skeleton className="mb-5 h-6 w-full max-w-xl rounded-md" />
          ) : (
            <p className="text-lg sm:text-xl text-zinc-200 font-normal mb-5 leading-relaxed">
              {data.tagline}
            </p>
          )}

          {/* Bio */}
          {isLoading ? (
            <div className="mb-10 max-w-2xl space-y-3">
              <span className="sr-only">Loading profile details</span>
              <div aria-hidden="true" className="space-y-3">
                <Skeleton className="h-4 w-full rounded-md sm:h-5" />
                <Skeleton className="h-4 w-[92%] rounded-md sm:h-5" />
                <Skeleton className="h-4 w-[68%] rounded-md sm:h-5" />
              </div>
            </div>
          ) : (
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
              {data.bio}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-12">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </>
            ) : data.location && (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {data.location}
              </span>
            )}
            {!isLoading && data.email && (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {data.email}
              </span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="#projects"
              className="button-accent inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:min-h-0 sm:text-base"
            >
              View My Work
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#contact"
              className="button-accent inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:min-h-0 sm:text-base"
            >
              Get in Touch
            </a>
            {data.resumeUrl && (
              <a
                href={data.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button-accent inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm sm:text-base transition-all duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
