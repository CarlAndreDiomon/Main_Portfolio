import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("achievements").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    issuer: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    badgeUrl: v.optional(v.string()),
    credentialUrl: v.optional(v.string()),
    category: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("achievements", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("achievements"),
    title: v.optional(v.string()),
    issuer: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    badgeUrl: v.optional(v.string()),
    credentialUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("achievements") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
