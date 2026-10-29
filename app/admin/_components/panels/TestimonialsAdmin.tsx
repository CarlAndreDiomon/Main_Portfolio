"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

const EMPTY = {
  name: "",
  role: "",
  company: "",
  content: "",
  avatarUrl: "",
  order: 0,
  visible: true,
};

export default function TestimonialsAdmin() {
  const items = useQuery(api.testimonials.listAll);
  const create = useMutation(api.testimonials.create);
  const update = useMutation(api.testimonials.update);
  const remove = useMutation(api.testimonials.remove);

  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<Id<"testimonials"> | null>(null);
  const [saved, setSaved] = useState(false);

  const set =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const startEdit = (t: NonNullable<typeof items>[0]) => {
    setEditId(t._id as Id<"testimonials">);
    setForm({
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      avatarUrl: t.avatarUrl ?? "",
      order: t.order,
      visible: t.visible,
    });
  };

  const reset = () => {
    setEditId(null);
    setForm(EMPTY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      role: form.role,
      company: form.company,
      content: form.content,
      avatarUrl: form.avatarUrl || undefined,
      order: Number(form.order),
      visible: form.visible,
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

  const sorted = [...(items ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>{sorted.length} Testimonials</span>
        {editId && (
          <button className="btn btn-ghost" onClick={reset}>
            + New
          </button>
        )}
      </div>

      <div className={styles.list}>
        {sorted.length === 0 && (
          <p className={styles.empty}>No testimonials yet.</p>
        )}
        {sorted.map((t) => (
          <div key={t._id} className={styles.listItem}>
            <div className={styles.listItemInfo}>
              <div className={styles.listItemTitle}>
                {t.name} {!t.visible && <span style={{ opacity: 0.5 }}>(Hidden)</span>}
              </div>
              <div className={styles.listItemMeta}>
                {t.role} at {t.company}
              </div>
            </div>
            <div className={styles.listItemActions}>
              <button className={styles.btnEdit} onClick={() => startEdit(t)}>
                Edit
              </button>
              <button
                className={styles.btnDelete}
                onClick={() => remove({ id: t._id as Id<"testimonials"> })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <div className={styles.formSectionTitle}>
          {editId ? "Edit Testimonial" : "Add Testimonial"}
        </div>

        <div className={styles.grid2}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Sarah Connor"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <input
              className="input"
              value={form.role}
              onChange={set("role")}
              placeholder="e.g. VP of Engineering"
              required
            />
          </div>
        </div>

        <div className={styles.grid2}>
          <div className="form-group">
            <label className="form-label">Company *</label>
            <input
              className="input"
              value={form.company}
              onChange={set("company")}
              placeholder="e.g. Acme Corp"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Avatar URL</label>
            <input
              className="input"
              value={form.avatarUrl}
              onChange={set("avatarUrl")}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Recommendation / Content *</label>
          <textarea
            className="input textarea"
            rows={4}
            value={form.content}
            onChange={set("content")}
            placeholder="Write what they said about working with you..."
            required
          />
        </div>

        <div className={styles.grid2}>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              className="input"
              value={form.order}
              onChange={set("order")}
            />
          </div>
          <div className="form-group" style={{ justifyContent: "center" }}>
            <label className={styles.checkbox} style={{ marginTop: "1.75rem" }}>
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) =>
                  setForm((f) => ({ ...f, visible: e.target.checked }))
                }
              />
              Visible on Portfolio
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          <button type="submit" className="btn btn-primary">
            {editId ? "Update Testimonial" : "Add Testimonial"}
          </button>
          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={reset}
            >
              Cancel
            </button>
          )}
          {saved && <span className={styles.savedMsg}>✓ Saved!</span>}
        </div>
      </form>
    </div>
  );
}
