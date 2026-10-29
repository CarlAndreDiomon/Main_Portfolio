"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

const EMPTY = { title: "", issuer: "", description: "", date: "", badgeUrl: "", credentialUrl: "", category: "certification", order: 0 };

export default function AchievementsAdmin() {
  const items = useQuery(api.achievements.list);
  const create = useMutation(api.achievements.create);
  const update = useMutation(api.achievements.update);
  const remove = useMutation(api.achievements.remove);

  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<Id<"achievements"> | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const startEdit = (a: NonNullable<typeof items>[0]) => {
    setEditId(a._id as Id<"achievements">);
    setForm({ title: a.title, issuer: a.issuer, description: a.description ?? "", date: a.date, badgeUrl: a.badgeUrl ?? "", credentialUrl: a.credentialUrl ?? "", category: a.category, order: a.order });
  };

  const reset = () => { setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, description: form.description || undefined, badgeUrl: form.badgeUrl || undefined, credentialUrl: form.credentialUrl || undefined, order: Number(form.order) };
    if (editId) await update({ id: editId, ...payload });
    else await create(payload);
    setSaved(true); setTimeout(() => setSaved(false), 2000); reset();
  };

  const sorted = [...(items ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>{sorted.length} Achievements</span>
        {editId && <button className="btn btn-ghost" onClick={reset}>+ New</button>}
      </div>
      <div className={styles.list}>
        {sorted.length === 0 && <p className={styles.empty}>No achievements yet.</p>}
        {sorted.map((a) => (
          <div key={a._id} className={styles.listItem}>
            <div className={styles.listItemInfo}>
              <div className={styles.listItemTitle}>{a.title}</div>
              <div className={styles.listItemMeta}>{a.issuer} · {a.category} · {a.date}</div>
            </div>
            <div className={styles.listItemActions}>
              <button className={styles.btnEdit} onClick={() => startEdit(a)}>Edit</button>
              <button className={styles.btnDelete} onClick={() => remove({ id: a._id as Id<"achievements"> })}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.formSection}>
        <p className={styles.formSectionTitle}>{editId ? "✏️ Edit Achievement" : "➕ Add Achievement"}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="input" value={form.title} onChange={set("title")} required placeholder="AWS Certified Developer" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" value={form.category} onChange={set("category")}>
                <option value="certification">Certification</option>
                <option value="award">Award</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
          </div>
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Issuer / Organization</label>
              <input className="input" value={form.issuer} onChange={set("issuer")} required placeholder="Amazon Web Services" />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="input" value={form.date} onChange={set("date")} required placeholder="Jun 2024" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea className="textarea" rows={2} value={form.description} onChange={set("description")} placeholder="Brief context..." />
          </div>
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label">Credential URL</label>
              <input className="input" value={form.credentialUrl} onChange={set("credentialUrl")} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input className="input" type="number" value={form.order} onChange={set("order")} />
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
