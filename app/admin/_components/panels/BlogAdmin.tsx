"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

const EMPTY = { title: "", slug: "", excerpt: "", content: "", coverImageUrl: "", tags: [] as string[], published: false };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogAdmin() {
  const posts = useQuery(api.blogs.list);
  const create = useMutation(api.blogs.create);
  const update = useMutation(api.blogs.update);
  const remove = useMutation(api.blogs.remove);

  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<Id<"blogs"> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const addTag = () => {
    if (tagInput.trim()) { setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(""); }
  };
  const removeTag = (t: string) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const startEdit = (p: NonNullable<typeof posts>[0]) => {
    setEditId(p._id as Id<"blogs">);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, coverImageUrl: p.coverImageUrl ?? "", tags: [...p.tags], published: p.published });
  };

  const reset = () => { setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (editId) {
      await update({ id: editId, title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, coverImageUrl: form.coverImageUrl || undefined, tags: form.tags, published: form.published, publishedAt: form.published ? now : undefined, updatedAt: now });
    } else {
      await create({ ...form, coverImageUrl: form.coverImageUrl || undefined, publishedAt: form.published ? now : undefined, createdAt: now, updatedAt: now });
    }
    setSaved(true); setTimeout(() => setSaved(false), 2000); reset();
  };

  const sorted = [...(posts ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>{sorted.length} Posts</span>
        {editId && <button className="btn btn-ghost" onClick={reset}>+ New Post</button>}
      </div>
      <div className={styles.list}>
        {sorted.length === 0 && <p className={styles.empty}>No posts yet.</p>}
        {sorted.map((p) => (
          <div key={p._id} className={styles.listItem}>
            <div className={styles.listItemInfo}>
              <div className={styles.listItemTitle}>{p.published ? "🟢 " : "⚫ "}{p.title}</div>
              <div className={styles.listItemMeta}>{p.slug} · {p.tags.join(", ")}</div>
            </div>
            <div className={styles.listItemActions}>
              <button className={styles.btnEdit} onClick={() => startEdit(p)}>Edit</button>
              <button className={styles.btnDelete} onClick={() => remove({ id: p._id as Id<"blogs"> })}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.formSection}>
        <p className={styles.formSectionTitle}>{editId ? "✏️ Edit Post" : "➕ New Post"}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="input" value={form.title} onChange={(e) => { set("title")(e); setForm((f) => ({ ...f, slug: slugify(e.target.value) })); }} required placeholder="My First Blog Post" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input className="input" value={form.slug} onChange={set("slug")} required placeholder="my-first-blog-post" />
          </div>
          <div className="form-group">
            <label className="form-label">Excerpt</label>
            <textarea className="textarea" rows={2} value={form.excerpt} onChange={set("excerpt")} required placeholder="A short summary..." />
          </div>
          <div className="form-group">
            <label className="form-label">Content (Markdown)</label>
            <textarea className="textarea" rows={10} value={form.content} onChange={set("content")} required placeholder="# Heading&#10;&#10;Write your content here..." style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }} />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="input" value={form.coverImageUrl} onChange={set("coverImageUrl")} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className={styles.tagInput}>
              <input className="input" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Engineering, Tutorial..." />
              <button type="button" className="btn btn-outline" onClick={addTag}>Add</button>
            </div>
            <div className={styles.tags}>
              {form.tags.map((t) => (
                <span key={t} className={styles.tagBadge}>{t}<button type="button" className={styles.tagRemove} onClick={() => removeTag(t)}>×</button></span>
              ))}
            </div>
          </div>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
            Published (visible on portfolio)
          </label>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
            <button type="submit" className="btn btn-primary">{editId ? "Update Post" : "Publish"}</button>
            {editId && <button type="button" className="btn btn-outline" onClick={reset}>Cancel</button>}
            {saved && <span className={styles.savedMsg}>✓ Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
