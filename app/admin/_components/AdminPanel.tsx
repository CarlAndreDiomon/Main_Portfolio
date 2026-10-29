"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

// Panels
import HeroAdmin from "./panels/HeroAdmin";
import ProjectsAdmin from "./panels/ProjectsAdmin";
import SkillsAdmin from "./panels/SkillsAdmin";
import ExperienceAdmin from "./panels/ExperienceAdmin";
import AchievementsAdmin from "./panels/AchievementsAdmin";
import BlogAdmin from "./panels/BlogAdmin";
import TestimonialsAdmin from "./panels/TestimonialsAdmin";
import SocialsAdmin from "./panels/SocialsAdmin";
import MessagesAdmin from "./panels/MessagesAdmin";

type Panel =
  | "hero"
  | "projects"
  | "skills"
  | "experience"
  | "achievements"
  | "blog"
  | "testimonials"
  | "socials"
  | "messages";

const PANELS: { id: Panel; label: string; icon: string }[] = [
  { id: "hero", label: "Hero & Bio", icon: "🏠" },
  { id: "projects", label: "Projects", icon: "💻" },
  { id: "skills", label: "Skills Stack", icon: "⚡" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "blog", label: "Blog Articles", icon: "📝" },
  { id: "testimonials", label: "Testimonials", icon: "💬" },
  { id: "socials", label: "Social Links", icon: "🔗" },
  { id: "messages", label: "Inbox Messages", icon: "📬" },
];

function sha256(str: string): Promise<string> {
  return crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(str))
    .then((buf) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
}

function LoginScreen({
  onLogin,
  isSetup,
  authError,
}: {
  onLogin: (hash: string, username: string) => void;
  isSetup: boolean;
  authError: boolean;
}) {
  const setup = useMutation(api.admin.setup);
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isSetup) {
        if (form.password !== form.confirm) {
          setError("Passwords do not match");
          return;
        }
        const hash = await sha256(form.password);
        await setup({ username: form.username, passwordHash: hash });
        onLogin(hash, form.username);
      } else {
        const hash = await sha256(form.password);
        onLogin(hash, form.username);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] p-4 sm:p-6">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#12121c] p-5 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-2xl shadow-inner">
            🔐
          </div>
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
            {isSetup ? "Portfolio CMS Login" : "Initialize Admin CMS"}
          </h1>
          <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {isSetup
              ? "Sign in to manage projects, skills, and articles dynamically"
              : "Set up your master credentials to configure the deployed system"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="admin-username">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              placeholder="e.g. admin"
              required
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {!isSetup && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5" htmlFor="admin-confirm">
                Confirm Password
              </label>
              <input
                id="admin-confirm"
                type="password"
                placeholder="••••••••"
                required
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          )}

          {(error || authError) && (
            <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error || "Invalid username or password"}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 min-h-12 w-full cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Authenticating..." : isSetup ? "Sign In to Dashboard" : "Create Master Account"}
          </button>
        </form>

        <p className="text-[11px] text-zinc-400 text-center mt-6">
          🛡 Protected CMS control center.
        </p>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const isSetup = useQuery(api.admin.checkSetup);

  const [authedHash, setAuthedHash] = useState<string | null>(null);
  const [authedUser, setAuthedUser] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<Panel>("hero");

  const isValid = useQuery(
    api.admin.login,
    authedHash && authedUser
      ? { username: authedUser, passwordHash: authedHash }
      : "skip"
  );

  if (isSetup === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-zinc-400 font-mono text-sm">
        Loading Convex CMS...
      </div>
    );
  }

  if (!authedHash || isValid === false) {
    return (
      <LoginScreen
        isSetup={!!isSetup}
        authError={!!authedHash && isValid === false}
        onLogin={(hash, username) => {
          setAuthedHash(hash);
          setAuthedUser(username);
        }}
      />
    );
  }

  const PANEL_MAP: Record<Panel, React.ReactNode> = {
    hero: <HeroAdmin />,
    projects: <ProjectsAdmin />,
    skills: <SkillsAdmin />,
    experience: <ExperienceAdmin />,
    achievements: <AchievementsAdmin />,
    blog: <BlogAdmin />,
    testimonials: <TestimonialsAdmin />,
    socials: <SocialsAdmin />,
    messages: <MessagesAdmin />,
  };

  return (
    <div className="admin-shell min-h-screen min-w-0 bg-[#0a0a0f] text-white">
      {/* Sidebar */}
      <aside className="admin-sidebar w-full shrink-0 border-b border-white/10 bg-[#0d0d14] p-4 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:justify-between md:border-b-0 md:border-r md:p-5">
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4 md:mb-6 md:pb-6">
            <span className="font-mono text-lg font-bold text-white flex items-center gap-1">
              <span className="text-violet-400">&lt;</span>
              <span>CMS Admin</span>
              <span className="text-violet-400">/&gt;</span>
            </span>
          </div>

          <nav aria-label="Admin sections" className="admin-nav -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 md:block md:space-y-1 md:overflow-visible md:pb-0">
            {PANELS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActivePanel(id)}
                className={`flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all md:w-full md:gap-3 md:px-3.5 ${
                  activePanel === id
                    ? "button-accent shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 flex flex-row gap-2 border-t border-white/5 pt-4 md:mt-6 md:flex-col md:pt-6">
          <a
            href="/"
            className="flex min-h-10 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white md:flex-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Live Portfolio
          </a>
          <button
            onClick={() => {
              setAuthedHash(null);
              setAuthedUser(null);
            }}
            className="flex min-h-10 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/10 md:flex-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main min-w-0 flex-1 overflow-y-auto bg-[#0a0a0f] p-4 sm:p-6 md:p-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6 flex flex-col items-start gap-3 border-b border-white/10 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
            <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-white sm:text-2xl">
              <span>{PANELS.find((p) => p.id === activePanel)?.icon}</span>
              <span>{PANELS.find((p) => p.id === activePanel)?.label}</span>
            </h2>
            <span className="max-w-full truncate rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300">
              👤 {authedUser}
            </span>
          </div>

          <div className="w-full">
            {PANEL_MAP[activePanel]}
          </div>
        </div>
      </main>
    </div>
  );
}
