import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socials")
      .collect();
  },
});

export const upsert = mutation({
  args: {
    platform: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("socials").collect();
    const found = existing.find((s) => s.platform === args.platform);
    if (found) {
      await ctx.db.patch(found._id, args);
    } else {
      await ctx.db.insert("socials", args);
    }
  },
});

export const remove = mutation({
  args: { id: v.id("socials") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
