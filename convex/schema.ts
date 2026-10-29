import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Admin credentials (single row)
  admin: defineTable({
    username: v.string(),
    passwordHash: v.string(),
  }),

  // Hero / about section
  hero: defineTable({
    name: v.string(),
    title: v.string(),
    tagline: v.string(),
    bio: v.string(),
    avatarUrl: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    email: v.optional(v.string()),
  }),

  // Social links
  socials: defineTable({
    platform: v.string(), // "github" | "linkedin" | "twitter" | "youtube" etc.
    url: v.string(),
    icon: v.optional(v.string()),
    order: v.number(),
  }),

  // Projects
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
    status: v.string(), // "completed" | "in-progress" | "archived"
  }),

  // Skills / Tech stack
  skills: defineTable({
    name: v.string(),
    category: v.string(), // "Frontend" | "Backend" | "Database" | "DevOps" | "Tools"
    level: v.number(), // 0-100
    icon: v.optional(v.string()),
    order: v.number(),
  }),

  // Work experience
  experience: defineTable({
    company: v.string(),
    role: v.string(),
    description: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()), // null = current
    location: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    order: v.number(),
  }),

  // Achievements / Certifications
  achievements: defineTable({
    title: v.string(),
    issuer: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    badgeUrl: v.optional(v.string()),
    credentialUrl: v.optional(v.string()),
    category: v.string(), // "certification" | "award" | "milestone"
    order: v.number(),
  }),

  // Blog posts
  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),

  // Testimonials
  testimonials: defineTable({
    name: v.string(),
    role: v.string(),
    company: v.string(),
    content: v.string(),
    avatarUrl: v.optional(v.string()),
    order: v.number(),
    visible: v.boolean(),
  }),

  // Contact / messages received
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.string(),
  }),

  // Site settings
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }),
});
