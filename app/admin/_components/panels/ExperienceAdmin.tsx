"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

const EMPTY = { company: "", role: "", description: "", startDate: "", endDate: "", location: "", logoUrl: "", tags: [] as string[], order: 0 };

export default function ExperienceAdmin() {
  const exp = useQuery(api.experience.list);
  const create = useMutation(api.experience.create);
  const update = useMutation(api.experience.update);
  const remove = useMutation(api.experience.remove);

  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<Id<"experience"> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const addTag = () => {
    if (tagInput.trim()) { setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(""); }
  };
  const removeTag = (t: string) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const startEdit = (e: NonNullable<typeof exp>[0]) => {
    setEditId(e._id as Id<"experience">);
    setForm({ company: e.company, role: e.role, description: e.description, startDate: e.startDate, endDate: e.endDate ?? "", location: e.location ?? "", logoUrl: e.logoUrl ?? "", tags: [...e.tags], order: e.order });
  };

  const reset = () => { setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { company: form.company, role: form.role, description: form.description, startDate: form.startDate, endDate: form.endDate || undefined, location: form.location || undefined, logoUrl: form.logoUrl || undefined, tags: form.tags, order: Number(form.order) };
    if (editId) await update({ id: editId, ...payload });
    else await create(payload);
    setSaved(true); setTimeout(() => setSaved(false), 2000); reset();
  };

  const sorted = [...(exp ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>{sorted.length} Positions</span>
        {editId && <button className="btn btn-ghost" onClick={reset}>+ New</button>}
      </div>
      <div className={styles.list}>
        {sorted.length === 0 && <p className={styles.empty}>No experience yet.</p>}
        {sorted.map((e) => (
          <div key={e._id} className={styles.listItem}>
            <div className={styles.listItemInfo}>
              <div className={styles.listItemTitle}>{e.role} @ {e.company}</div>
              <div className={styles.listItemMeta}>{e.startDate} — {e.endDate ?? "Present"}</div>
            </div>
            <div className={styles.listItemActions}>
              <button className={styles.btnEdit} onClick={() => startEdit(e)}>Edit</button>
              <button className={styles.btnDelete} onClick={() => remove({ id: e._id as Id<"experience"> })}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.formSection}>
        <p className={styles.formSectionTitle}>{editId ? "✏️ Edit Experience" : "➕ Add Experience"}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="input" value={form.company} onChange={set("company")} required placeholder="Acme Corp" />
            </div>
            <div className="form-group">
              <label className="form-label">Role / Title</label>
              <input className="input" value={form.role} onChange={set("role")} required placeholder="Product Engineer" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="textarea" rows={3} value={form.description} onChange={set("description")} required placeholder="What you did..." />
          </div>
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="input" value={form.startDate} onChange={set("startDate")} required placeholder="Jan 2023" />
            </div>
            <div className="form-group">
              <label className="form-label">End Date (leave blank = Present)</label>
              <input className="input" value={form.endDate} onChange={set("endDate")} placeholder="Dec 2024" />
            </div>
          </div>
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="input" value={form.location} onChange={set("location")} placeholder="Remote / Manila" />
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input className="input" type="number" value={form.order} onChange={set("order")} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tech Tags</label>
            <div className={styles.tagInput}>
              <input className="input" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="React, Node.js..." />
              <button type="button" className="btn btn-outline" onClick={addTag}>Add</button>
            </div>
            <div className={styles.tags}>
              {form.tags.map((t) => (
                <span key={t} className={styles.tagBadge}>{t}<button type="button" className={styles.tagRemove} onClick={() => removeTag(t)}>×</button></span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
            <button type="submit" className="btn btn-primary">{editId ? "Update" : "Add"}</button>
            {editId && <button type="button" className="btn btn-outline" onClick={reset}>Cancel</button>}
            {saved && <span className={styles.savedMsg}>✓ Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
