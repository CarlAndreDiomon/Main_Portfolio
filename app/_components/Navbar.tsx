"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "../_providers/ThemeProvider";

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#achievements", label: "Achievements" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/25 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="site-container flex items-center justify-between">
        {/* Logo */}
        <Link href="#hero" className="flex items-center gap-1 font-mono text-xl font-bold tracking-tight text-white group">
          <span className="text-violet-400 group-hover:text-cyan-400 transition-colors">&lt;</span>
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-sans">
            Portfolio
          </span>
          <span className="text-violet-400 group-hover:text-cyan-400 transition-colors">/&gt;</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1.5 list-none m-0 p-0">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active === href.slice(1)
                    ? "button-accent shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="ml-3">
            <a
              href="/admin"
              className="button-accent px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5"
            >
              <span>CMS</span>
              <span className="text-sky-300">⚙</span>
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="button-accent ml-auto mr-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:ml-0 md:mr-0"
        >
          {theme === "dark" ? (
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.463.402.807a6.5 6.5 0 0 0 8.268 8.268c.344-.215.829-.003.803.397Z" />
            </svg>
          )}
        </button>

        {/* Hamburger */}
        <button
          className="button-accent md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-colors gap-1.5"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`w-5 h-0.5 bg-current transition-transform duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-current transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-current transition-transform duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="animate-fade-in flex flex-col gap-2 border-b border-white/10 bg-[#0d0d14]/95 px-4 py-4 shadow-2xl backdrop-blur-xl sm:px-6 sm:py-6 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`min-h-11 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                active === href.slice(1)
                  ? "button-accent"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="/admin"
            className="button-accent px-4 py-2.5 rounded-lg text-sm font-mono font-medium"
            onClick={() => setMenuOpen(false)}
          >
            ⚙ Admin Dashboard
          </a>
        </div>
      )}
    </nav>
  );
}
