import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,

  boolean,
  index,
} from "drizzle-orm/mysql-core";

// ============================================================
// Users (OAuth-based, managed by auth feature)
// ============================================================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================
// Local Users (username/password auth)
// ============================================================
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// ============================================================
// Businesses (posted by members)
// ============================================================
export const businesses = mysqlTable(
  "businesses",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 500 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 320 }),
    website: varchar("website", { length: 500 }),
    imageUrl: text("image_url"),
    ownerId: varchar("owner_id", { length: 255 }).notNull(),
    ownerType: mysqlEnum("owner_type", ["oauth", "local"])
      .default("oauth")
      .notNull(),
    views: int("views").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    ownerIdx: index("owner_idx").on(table.ownerId),
    categoryIdx: index("category_idx").on(table.category),
  })
);

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;

// ============================================================
// Events (associated with businesses)
// ============================================================
export const events = mysqlTable(
  "events",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    businessId: bigint("business_id", {
      mode: "number",
      unsigned: true,
    }).notNull(),
    location: varchar("location", { length: 500 }),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    imageUrl: text("image_url"),
    status: mysqlEnum("status", ["draft", "published", "cancelled"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    businessIdx: index("event_business_idx").on(table.businessId),
    startDateIdx: index("start_date_idx").on(table.startDate),
  })
);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ============================================================
// Subscriptions (Stripe subscription records)
// ============================================================
export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    userType: mysqlEnum("user_type", ["oauth", "local"])
      .default("oauth")
      .notNull(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", {
      length: 255,
    }),
    stripePriceId: varchar("stripe_price_id", { length: 255 }),
    planName: varchar("plan_name", { length: 100 }).notNull(),
    status: mysqlEnum("status", [
      "active",
      "cancelled",
      "past_due",
      "unpaid",
      "trialing",
    ])
      .default("trialing")
      .notNull(),
    currentPeriodStart: timestamp("current_period_start"),
    currentPeriodEnd: timestamp("current_period_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdx: index("sub_user_idx").on(table.userId),
    stripeSubIdx: index("stripe_sub_idx").on(table.stripeSubscriptionId),
  })
);

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ============================================================
// Activity Logs (for admin tracking)
// ============================================================
export const activityLogs = mysqlTable(
  "activity_logs",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }),
    userName: varchar("user_name", { length: 255 }),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 100 }).notNull(),
    entityId: varchar("entity_id", { length: 255 }),
    entityName: varchar("entity_name", { length: 255 }),
    details: text("details"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("log_user_idx").on(table.userId),
    createdIdx: index("log_created_idx").on(table.createdAt),
  })
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

// ============================================================
// Feedback / Suggestions
// ============================================================
export const feedback = mysqlTable("feedback", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  type: mysqlEnum("type", ["suggestion", "bug", "praise", "other"])
    .default("suggestion")
    .notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;

// ============================================================
// Chat Messages (AI chat history)
// ============================================================
export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
