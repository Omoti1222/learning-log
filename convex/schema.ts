import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  cards: defineTable({
    title: v.string(),
    hypothesis: v.string(),
    success: v.string(),
    status: v.string(),
    result: v.string(),
    learning: v.string(),
    comment: v.string(),
    createdAt: v.string(),
    completedAt: v.optional(v.string()),
  }),
});
