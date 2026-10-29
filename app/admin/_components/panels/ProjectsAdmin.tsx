"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

type ProjectStatus = "completed" | "in-progress" | "archived";

const EMPTY_FORM = {
  title: "", description: "", longDescription: "", imageUrl: "",
  tags: [] as string[], liveUrl: "", githubUrl: "",
  featured: false, order: 0, status: "completed" as ProjectStatus,
};

export default function ProjectsAdmin() {
  const projects = useQuery(api.projects.list);
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<Id<"projects"> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const removeTag = (t: string) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const startEdit = (p: typeof projects extends (infer U)[] | undefined ? U : never) => {
    if (!p) return;
    setEditId(p._id as Id<"projects">);
    setForm({
      title: p.title, description: p.description,
      longDescription: p.longDescription ?? "",
      imageUrl: p.imageUrl ?? "", tags: [...p.tags],
      liveUrl: p.liveUrl ?? "", githubUrl: p.githubUrl ?? "",
      featured: p.featured, order: p.order, status: p.status as ProjectStatus,
    });
  };

  const reset = () => { setEditId(null); setForm(EMPTY_FORM); setTagInput(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title, description: form.description,
      longDescription: form.longDescription || undefined,
      imageUrl: form.imageUrl || undefined,
      tags: form.tags,
      liveUrl: form.liveUrl || undefined,
      githubUrl: form.githubUrl || undefined,
      featured: form.featured,
      order: Number(form.order),
      status: form.status,
    };
    if (editId) {
      await update({ id: editId, ...payload });
    } else {
      await create(payload);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    reset();
  };

  const sorted = [...(projects ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* List */}
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>{sorted.length} Projects</span>
        {editId && (
          <button className="btn btn-ghost" onClick={reset} type="button">
            + New Project
          </button>
        )}
      </div>

      <div className={styles.list}>
        {sorted.length === 0 && <p className={styles.empty}>No projects yet. Add one below!</p>}
        {sorted.map((p) => (
          <div key={p._id} className={styles.listItem}>
            <div className={styles.listItemInfo}>
              <div className={styles.listItemTitle}>
                {p.featured ? "⭐ " : ""}{p.title}
              </div>
              <div className={styles.listItemMeta}>{p.status} · {p.tags.slice(0, 3).join(", ")}</div>
            </div>
            <div className={styles.listItemActions}>
              <button className={styles.btnEdit} onClick={() => startEdit(p)}>Edit</button>
              <button className={styles.btnDelete} onClick={() => remove({ id: p._id as Id<"projects"> })}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className={styles.formSection}>
        <p className={styles.formSectionTitle}>{editId ? "✏️ Edit Project" : "➕ Add Project"}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="input" value={form.title} onChange={set("title")} required placeholder="Project Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="select" value={form.status} onChange={set("status")}>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea className="textarea" rows={2} value={form.description} onChange={set("description")} required placeholder="Brief summary..." />
          </div>
          <div className="form-group">
            <label className="form-label">Long Description (optional)</label>
            <textarea className="textarea" rows={3} value={form.longDescription} onChange={set("longDescription")} placeholder="Detailed description..." />
          </div>
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Live URL</label>
              <input className="input" value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input className="input" value={form.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com/..." />
            </div>
          </div>
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="input" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Order (lower = first)</label>
              <input className="input" type="number" value={form.order} onChange={set("order")} />
            </div>
          </div>
          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tech Tags</label>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-stretch gap-2">
              <input className="input min-w-0 w-full" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="React, Node.js..." />
              <button type="button" className="btn btn-outline" onClick={addTag}>Add</button>
            </div>
            <div className={styles.tags}>
              {form.tags.map((t) => (
                <span key={t} className={styles.tagBadge}>
                  {t}
                  <button type="button" className={styles.tagRemove} onClick={() => removeTag(t)}>×</button>
                </span>
              ))}
            </div>
          </div>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
            Featured project (shown first)
          </label>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
            <button type="submit" className="btn btn-primary">{editId ? "Update" : "Add Project"}</button>
            {editId && <button type="button" className="btn btn-outline" onClick={reset}>Cancel</button>}
            {saved && <span className={styles.savedMsg}>✓ Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
