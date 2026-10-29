import { query, mutation, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { type Doc } from "./_generated/dataModel";
import schema from "./schema";

async function withImageUrls(ctx: QueryCtx, projects: Doc<"projects">[]) {
  return await Promise.all(
    projects.map(async (project) => {
      const imageUrl = project.imageStorageId
        ? (await ctx.storage.getUrl(project.imageStorageId)) ?? undefined
        : project.imageUrl;
      return imageUrl === undefined ? project : { ...project, imageUrl };
    })
  );
}

export const list = query({
  args: {},
  returns: v.array(schema.doc("projects")),
  handler: async (ctx) => {
    return await withImageUrls(ctx, await ctx.db.query("projects").collect());
  },
});

export const featured = query({
  args: {},
  returns: v.array(schema.doc("projects")),
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
    return await withImageUrls(ctx, projects);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    tags: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
    status: v.string(),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    tags: v.optional(v.array(v.string())),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...rest }) => {
    const { imageStorageId, ...fields } = rest;
    const project = await ctx.db.get(id);
    if (!project) {
      throw new Error("Project not found");
    }

    if (imageStorageId !== undefined) {
      if (project.imageStorageId && project.imageStorageId !== imageStorageId) {
        await ctx.storage.delete(project.imageStorageId);
      }
      await ctx.db.patch(id, {
        ...fields,
        imageStorageId: imageStorageId ?? undefined,
        imageUrl: undefined,
      });
    } else {
      await ctx.db.patch(id, fields);
    }
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id);
    if (project?.imageStorageId) {
      await ctx.storage.delete(project.imageStorageId);
    }
    await ctx.db.delete(id);
    return null;
  },
});
