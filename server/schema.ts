import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"

export const emojis = pgTable("Emoji", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  prompt: text("prompt").notNull(),
  isFlagged: boolean("isFlagged").default(false),
  isFeatured: boolean("isFeatured").default(false),
  originalUrl: text("originalUrl"),
  noBackgroundUrl: text("noBackgroundUrl"),
  safetyRating: integer("safetyRating").notNull(),
  error: text("error"),
})

export type Emoji = typeof emojis.$inferSelect
export type NewEmoji = typeof emojis.$inferInsert 