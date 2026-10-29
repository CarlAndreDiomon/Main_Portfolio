"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Skeleton from "../../../_components/Skeleton";
import styles from "./Panel.module.css";

const EMPTY = { name: "", category: "Frontend", level: 80, icon: "", order: 0 };
const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"];

export default function SkillsAdmin() {
  const skills = useQuery(api.skills.list);
  const create = useMutation(api.skills.create);
  const update = useMutation(api.skills.update);
  const remove = useMutation(api.skills.remove);

  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<Id<"skills"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const setField = (field: "name" | "category" | "level" | "icon" | "order") =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((current) => ({
        ...current,
        [field]: field === "level" || field === "order" ? Number(value) : value,
      }));
      setSaved(false);
      setError("");
    };

  const reset = () => {
    setForm(EMPTY);
    setEditId(null);
    setSaved(false);
    setError("");
  };

  const startEdit = (skill: NonNullable<typeof skills>[number]) => {
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon ?? "",
      order: skill.order,
    });
    setEditId(skill._id);
    setSaved(false);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const payload = {
        ...form,
        icon: form.icon.trim() || undefined,
      };
      if (editId) await update({ id: editId, ...payload });
      else await create(payload);

      reset();
      setSaved(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save the skill. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"skills">) => {
    if (!window.confirm("Delete this skill?")) return;
    setError("");
    try {
      await remove({ id });
      if (editId === id) reset();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete the skill. Please try again."
      );
    }
  };

  const sorted = [...(skills ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.skillsPanel}>
      <section className={styles.skillsSection} aria-labelledby="skills-list-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h3 id="skills-list-heading" className={styles.sectionTitle}>Your skills</h3>
            <p className={styles.sectionDescription}>
              These appear in the Skills section of your portfolio.
            </p>
          </div>
          <span className={styles.countBadge}>
            {skills === undefined
              ? "Loading…"
              : `${sorted.length} ${sorted.length === 1 ? "skill" : "skills"}`}
          </span>
        </div>

        {error && <p className={styles.skillsError} role="alert">{error}</p>}

        {skills === undefined ? (
          <div className={styles.skillList} aria-busy="true" aria-label="Loading skills">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className={styles.emptyState}>
            <h4 className={styles.emptyTitle}>No skills added yet</h4>
            <p className={styles.emptyDescription}>
              Add a skill to show visitors what you work with.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => document.getElementById("skill-name")?.focus()}
            >
              Add your first skill
            </button>
          </div>
        ) : (
          <div className={styles.skillList}>
            {sorted.map((skill) => (
              <article key={skill._id} className={styles.skillRow}>
                <div className={styles.skillIcon} aria-hidden="true">
                  {skill.icon || skill.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.skillDetails}>
                  <div className={styles.skillInfo}>
                    <h4 className={styles.skillName}>{skill.name}</h4>
                    <span className={styles.skillCategory}>{skill.category}</span>
                  </div>
                  <div className={styles.proficiency}>
                    <div className={styles.progressTrack}
                      role="progressbar"
                      aria-label={`${skill.name} proficiency`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={skill.level}
                    >
                      <span className={styles.progressFill} style={{ width: `${skill.level}%` }} />
                    </div>
                    <span className={styles.skillLevel}>{skill.level}%</span>
                  </div>
                </div>
                <div className={styles.skillActions}>
                  <button
                    type="button"
                    className={`btn button-accent ${styles.btnEdit}`}
                    aria-label={`Edit ${skill.name}`}
                    onClick={() => startEdit(skill)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                      <path d="m13.5 3.5 3 3M4 16l3.5-.7L16 6.8a2.1 2.1 0 0 0-3-3l-8.5 8.5L4 16Z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className={`btn ${styles.btnDelete}`}
                    aria-label={`Delete ${skill.name}`}
                    onClick={() => handleDelete(skill._id)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                      <path d="M4.5 6h11M8 6V4h4v2m2 0-.6 10H6.6L6 6m2.5 3v4m3-4v4" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.skillsSection} aria-labelledby="skill-form-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h3 id="skill-form-heading" className={styles.sectionTitle}>
          {editId ? "Edit skill" : "Add a skill"}
            </h3>
            <p className={styles.sectionDescription}>
              {editId ? "Update the details visitors see." : "Enter the skill you want to highlight."}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.skillForm}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="skill-name">Skill name</label>
              <input
                id="skill-name"
                className="input"
                value={form.name}
                onChange={setField("name")}
                placeholder="e.g. React.js"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="skill-category">Category</label>
              <select
                id="skill-category"
                className="select"
                value={form.category}
                onChange={setField("category")}
              >
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.proficiencyHeader}>
              <label className={styles.fieldLabel} htmlFor="skill-level">Proficiency</label>
              <output className={styles.proficiencyValue} htmlFor="skill-level">{form.level}%</output>
            </div>
            <input
              id="skill-level"
              type="range"
              min={0}
              max={100}
              value={form.level}
              onChange={setField("level")}
              className={styles.proficiencyRange}
            />
            <div className={styles.rangeLabels} aria-hidden="true">
              <span>Beginner</span>
              <span>Proficient</span>
              <span>Expert</span>
            </div>
          </div>

          <details className={styles.displayOptions}>
            <summary>Display options</summary>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="skill-icon">
                  Icon or emoji <span>(optional)</span>
                </label>
                <input
                  id="skill-icon"
                  className="input"
                  value={form.icon}
                  onChange={setField("icon")}
                  placeholder="e.g. ⚛️"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="skill-order">Display order</label>
                <input
                  id="skill-order"
                  className="input"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={setField("order")}
                />
                <span className={styles.fieldHint}>Lower numbers appear first.</span>
              </div>
            </div>
          </details>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editId ? "Save changes" : "Add skill"}
            </button>
            {editId && (
              <button type="button" className="btn btn-outline" onClick={reset} disabled={saving}>
                Cancel
              </button>
            )}
            {saved && <span className={styles.savedMsg} role="status">Skill saved.</span>}
          </div>
        </form>
      </section>
    </div>
  );
}
