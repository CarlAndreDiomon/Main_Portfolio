"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import styles from "./Panel.module.css";

export default function HeroAdmin() {
  const hero = useQuery(api.hero.get);
  const upsert = useMutation(api.hero.upsert);
  const [form, setForm] = useState({
    name: "", title: "", tagline: "", bio: "",
    avatarUrl: "", resumeUrl: "", location: "", email: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        name: hero.name,
        title: hero.title,
        tagline: hero.tagline,
        bio: hero.bio,
        avatarUrl: hero.avatarUrl ?? "",
        resumeUrl: hero.resumeUrl ?? "",
        location: hero.location ?? "",
        email: hero.email ?? "",
      });
    }
  }, [hero]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsert({
      name: form.name,
      title: form.title,
      tagline: form.tagline,
      bio: form.bio,
      avatarUrl: form.avatarUrl || undefined,
      resumeUrl: form.resumeUrl || undefined,
      location: form.location || undefined,
      email: form.email || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid2}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="input" value={form.name} onChange={set("name")} placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <label className="form-label">Title / Role</label>
          <input className="input" value={form.title} onChange={set("title")} placeholder="Product Engineer" required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Tagline (short, punchy line)</label>
        <input className="input" value={form.tagline} onChange={set("tagline")} placeholder="I build things that matter." required />
      </div>
      <div className="form-group">
        <label className="form-label">Bio</label>
        <textarea className="textarea" rows={4} value={form.bio} onChange={set("bio")} placeholder="A longer description about you..." required />
      </div>
      <div className={styles.grid2}>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="input" value={form.location} onChange={set("location")} placeholder="Philippines" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="hello@example.com" />
        </div>
      </div>
      <div className={styles.grid2}>
        <div className="form-group">
          <label className="form-label">Avatar URL</label>
          <input className="input" value={form.avatarUrl} onChange={set("avatarUrl")} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label className="form-label">Resume URL</label>
          <input className="input" value={form.resumeUrl} onChange={set("resumeUrl")} placeholder="https://..." />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
        <button type="submit" className="btn btn-primary">Save Changes</button>
        {saved && <span className={styles.savedMsg}>✓ Saved!</span>}
      </div>
    </form>
  );
}
