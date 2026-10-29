import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const heroes = await ctx.db.query("hero").collect();
    return heroes[0] ?? null;
  },
});

export const upsert = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    tagline: v.string(),
    bio: v.string(),
    avatarUrl: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("hero").collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, args);
    } else {
      await ctx.db.insert("hero", args);
    }
  },
});
