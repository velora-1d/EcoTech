import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean
} from "drizzle-orm/pg-core";

export type UserRole = "user" | "admin";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: text("role").notNull().default("user"),
  points: integer("points").notNull().default(0),
  isBlocked: boolean("is_blocked").notNull().default(false),
  
  // ALAMAT WILAYAH INDONESIA
  province: text("province"),
  regency: text("regency"),
  district: text("district"),
  village: text("village"),
  hamlet: text("hamlet"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  emailIdx: index("idx_users_email").on(table.email)
}));

export const rewards = pgTable("rewards", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  stock: integer("stock").notNull().default(10),
  category: text("category").notNull().default("voucher"), // "voucher" | "goods" | "seed"
  validUntil: timestamp("valid_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  costIdx: index("idx_rewards_cost").on(table.cost)
}));

export const trashGuides = pgTable("trash_guides", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryKey: text("category_key").notNull().unique(), // "plastic" | "paper" | "glass" | "organic" dll
  title: text("title").notNull(),
  pointsPerItem: integer("points_per_item").notNull().default(10),
  basePoints: integer("base_points").notNull().default(5),
  instruction: text("instruction").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  categoryKeyIdx: index("idx_trash_guides_key").on(table.categoryKey)
}));

export const disposals = pgTable("disposals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  categoryKey: text("category_key").notNull(),
  itemCount: integer("item_count").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "approved" | "rejected"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  categoryIdx: index("idx_disposals_category_key").on(table.categoryKey),
  createdAtIdx: index("idx_disposals_created_at").on(table.createdAt),
  userIdx: index("idx_disposals_user_id").on(table.userId),
  statusIdx: index("idx_disposals_status").on(table.status)
}));

export const redemptions = pgTable("redemptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rewardId: uuid("reward_id").notNull().references(() => rewards.id),
  pointsSpent: integer("points_spent").notNull(),
  code: text("code").notNull().unique(), // Format: ECO-XXXXXX
  status: text("status").notNull().default("pending"), // "pending" | "completed"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userIdx: index("idx_redemptions_user_id").on(table.userId),
  codeIdx: index("idx_redemptions_code").on(table.code)
}));

export const complaints = pgTable("complaints", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  image: text("image"), // Base64 image
  status: text("status").notNull().default("pending"), // "pending" | "investigating" | "resolved" | "rejected"
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userIdx: index("idx_complaints_user_id").on(table.userId),
  statusIdx: index("idx_complaints_status").on(table.status)
}));


