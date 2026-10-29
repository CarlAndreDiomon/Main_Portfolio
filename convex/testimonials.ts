import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .filter((q) => q.eq(q.field("visible"), true))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("testimonials").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    company: v.string(),
    content: v.string(),
    avatarUrl: v.optional(v.string()),
    order: v.number(),
    visible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testimonials", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("testimonials"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    company: v.optional(v.string()),
    content: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    order: v.optional(v.number()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
