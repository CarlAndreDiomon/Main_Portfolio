"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

type ProjectStatus = "completed" | "in-progress" | "archived";

const EMPTY_FORM = {
  title: "", description: "", longDescription: "",
  imageStorageId: null as Id<"_storage"> | null, imagePreviewUrl: "", removeImage: false,
  tags: [] as string[], liveUrl: "", githubUrl: "",
  featured: false, order: 0, status: "completed" as ProjectStatus,
};

export default function ProjectsAdmin() {
  const projects = useQuery(api.projects.list);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<Id<"projects"> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previewUrl = form.imagePreviewUrl;
    if (!previewUrl.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [form.imagePreviewUrl]);

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
    setEditId(p._id);
    setForm({
      title: p.title, description: p.description,
      longDescription: p.longDescription ?? "",
      imageStorageId: p.imageStorageId ?? null,
      imagePreviewUrl: p.imageUrl ?? "",
      removeImage: false,
      tags: [...p.tags],
      liveUrl: p.liveUrl ?? "", githubUrl: p.githubUrl ?? "",
      featured: p.featured, order: p.order, status: p.status as ProjectStatus,
    });
    setPendingImage(null);
    setError("");
    setSaved(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const reset = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setTagInput("");
    setPendingImage(null);
    setError("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!supportedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, WebP, or GIF image.");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The image must be 10 MB or smaller.");
      e.target.value = "";
      return;
    }

    setError("");
    setSaved(false);
    setPendingImage(file);
    setForm((current) => ({
      ...current,
      imagePreviewUrl: URL.createObjectURL(file),
      removeImage: false,
    }));
  };

  const clearImage = () => {
    setPendingImage(null);
    setForm((current) => ({
      ...current,
      imageStorageId: null,
      imagePreviewUrl: "",
      removeImage: Boolean(editId),
    }));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let uploadedImageId: Id<"_storage"> | undefined;
      if (pendingImage) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": pendingImage.type },
          body: pendingImage,
        });
        if (!response.ok) {
          throw new Error("Image upload failed. Please try again.");
        }

        const result: unknown = await response.json();
        if (
          typeof result !== "object" ||
          result === null ||
          !("storageId" in result) ||
          typeof result.storageId !== "string"
        ) {
          throw new Error("Image upload returned an invalid response.");
        }
        uploadedImageId = result.storageId as Id<"_storage">;
      }

      const payload = {
        title: form.title,
        description: form.description,
        longDescription: form.longDescription || undefined,
        tags: form.tags,
        liveUrl: form.liveUrl || undefined,
        githubUrl: form.githubUrl || undefined,
        featured: form.featured,
        order: Number(form.order),
        status: form.status,
      };
      const imageStorageId = uploadedImageId ?? form.imageStorageId;

      if (editId) {
        await update({
          id: editId,
          ...payload,
          ...(form.removeImage
            ? { imageStorageId: null }
            : imageStorageId
              ? { imageStorageId }
              : {}),
        });
      } else {
        await create({
          ...payload,
          ...(imageStorageId ? { imageStorageId } : {}),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save the project. Please try again."
      );
    } finally {
      setSaving(false);
    }
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
              <button className={styles.btnDelete} onClick={() => remove({ id: p._id })}>Delete</button>
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
              <label className="form-label" htmlFor="project-image">Project image</label>
              <div className={styles.projectImagePicker}>
                {form.imagePreviewUrl ? (
                  <Image
                    className={styles.projectImagePreview}
                    src={form.imagePreviewUrl}
                    alt="Project image preview"
                    width={160}
                    height={100}
                    unoptimized
                  />
                ) : (
                  <div className={styles.projectImagePlaceholder} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                )}
                <div className={styles.projectImageControls}>
                  <input
                    ref={imageInputRef}
                    id="project-image"
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    disabled={saving}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={saving}
                  >
                    {form.imagePreviewUrl ? "Choose another image" : "Choose image"}
                  </button>
                  {form.imagePreviewUrl && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={clearImage}
                      disabled={saving}
                    >
                      Remove image
                    </button>
                  )}
                  <span className={styles.projectImageHelp}>
                    JPG, PNG, WebP, or GIF. Maximum 10 MB.
                  </span>
                  {error && <span className={styles.projectImageError} role="alert">{error}</span>}
                </div>
              </div>
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editId ? "Update" : "Add Project"}
            </button>
            {editId && <button type="button" className="btn btn-outline" onClick={reset} disabled={saving}>Cancel</button>}
            {saved && <span className={styles.savedMsg}>✓ Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
