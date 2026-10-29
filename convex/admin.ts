import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple admin auth — stores hashed password (SHA-256 hex)
// In production you'd use a proper auth provider

export const checkSetup = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query("admin").collect();
    return admins.length > 0;
  },
});

export const setup = mutation({
  args: {
    username: v.string(),
    passwordHash: v.string(), // SHA-256 hex from client
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("admin").collect();
    if (existing.length > 0) {
      throw new Error("Admin already set up");
    }
    return await ctx.db.insert("admin", args);
  },
});

export const login = query({
  args: {
    username: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, { username, passwordHash }) => {
    const admins = await ctx.db.query("admin").collect();
    const admin = admins.find(
      (a) => a.username === username && a.passwordHash === passwordHash
    );
    return admin ? true : false;
  },
});

export const changePassword = mutation({
  args: {
    currentPasswordHash: v.string(),
    newPasswordHash: v.string(),
  },
  handler: async (ctx, { currentPasswordHash, newPasswordHash }) => {
    const admins = await ctx.db.query("admin").collect();
    const admin = admins[0];
    if (!admin || admin.passwordHash !== currentPasswordHash) {
      throw new Error("Invalid current password");
    }
    await ctx.db.patch(admin._id, { passwordHash: newPasswordHash });
  },
});
