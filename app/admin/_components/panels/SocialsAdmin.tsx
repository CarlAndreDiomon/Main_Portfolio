"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

const PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "youtube",
  "email",
  "instagram",
  "discord",
  "medium",
  "website",
];

const EMPTY = {
  platform: "github",
  url: "",
  icon: "",
  order: 0,
};

export default function SocialsAdmin() {
  const items = useQuery(api.socials.list);
  const upsert = useMutation(api.socials.upsert);
  const remove = useMutation(api.socials.remove);

  const [form, setForm] = useState(EMPTY);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const startEdit = (s: NonNullable<typeof items>[0]) => {
    setEditingPlatform(s.platform);
    setForm({
      platform: s.platform,
      url: s.url,
      icon: s.icon ?? "",
      order: s.order,
    });
  };

  const reset = () => {
    setEditingPlatform(null);
    setForm(EMPTY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsert({
      platform: form.platform,
      url: form.url,
      icon: form.icon || undefined,
      order: Number(form.order),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    reset();
  };

  const sorted = [...(items ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>{sorted.length} Social Links</span>
        {editingPlatform && (
          <button className="btn btn-ghost" onClick={reset}>
            + New
          </button>
        )}
      </div>

      <div className={styles.list}>
        {sorted.length === 0 && (
          <p className={styles.empty}>No social links configured yet.</p>
        )}
        {sorted.map((s) => (
          <div key={s._id} className={styles.listItem}>
            <div className={styles.listItemInfo}>
              <div className={styles.listItemTitle} style={{ textTransform: "capitalize" }}>
                {s.platform}
              </div>
              <div className={styles.listItemMeta}>{s.url}</div>
            </div>
            <div className={styles.listItemActions}>
              <button className={styles.btnEdit} onClick={() => startEdit(s)}>
                Edit
              </button>
              <button
                className={styles.btnDelete}
                onClick={() => remove({ id: s._id as Id<"socials"> })}
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
          {editingPlatform ? `Edit ${editingPlatform} Link` : "Add Social Link"}
        </div>

        <div className={styles.grid2}>
          <div className="form-group">
            <label className="form-label">Platform *</label>
            <select
              className="input select"
              value={form.platform}
              onChange={set("platform")}
              required
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Profile / Destination URL *</label>
            <input
              className="input"
              value={form.url}
              onChange={set("url")}
              placeholder="https://github.com/username or mailto:..."
              required
            />
          </div>
        </div>

        <div className={styles.grid2}>
          <div className="form-group">
            <label className="form-label">Custom Icon or SVG (Optional)</label>
            <input
              className="input"
              value={form.icon}
              onChange={set("icon")}
              placeholder="Emoji or SVG snippet"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              className="input"
              value={form.order}
              onChange={set("order")}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          <button type="submit" className="btn btn-primary">
            {editingPlatform ? "Update Social Link" : "Save Social Link"}
          </button>
          {editingPlatform && (
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
