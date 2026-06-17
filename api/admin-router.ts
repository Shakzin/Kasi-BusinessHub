import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, localUsers, businesses, events, subscriptions, activityLogs, feedback } from "@db/schema";
import { desc, sql, gte } from "drizzle-orm";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();

    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    const localUserCount = await db.select({ count: sql<number>`count(*)` }).from(localUsers);
    const businessCount = await db.select({ count: sql<number>`count(*)` }).from(businesses);
    const eventCount = await db.select({ count: sql<number>`count(*)` }).from(events);
    const activeSubs = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(sql`${subscriptions.status} = 'active'`);

    // Revenue calculation (mock based on plan names)
    const subRows = await db.select().from(subscriptions).where(sql`${subscriptions.status} = 'active'`);
    let totalRevenue = 0;
    for (const sub of subRows) {
      if (sub.planName === "Starter") totalRevenue += 9;
      else if (sub.planName === "Professional") totalRevenue += 29;
      else if (sub.planName === "Enterprise") totalRevenue += 99;
    }

    // Category breakdown
    const categories = await db
      .select({
        category: businesses.category,
        count: sql<number>`count(*)`,
      })
      .from(businesses)
      .groupBy(businesses.category);

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOAuthUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, sevenDaysAgo));

    const recentLocalUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(localUsers)
      .where(gte(localUsers.createdAt, sevenDaysAgo));

    return {
      totalUsers: (userCount[0]?.count || 0) + (localUserCount[0]?.count || 0),
      totalBusinesses: businessCount[0]?.count || 0,
      totalEvents: eventCount[0]?.count || 0,
      activeSubscriptions: activeSubs[0]?.count || 0,
      totalRevenue,
      recentSignups: (recentOAuthUsers[0]?.count || 0) + (recentLocalUsers[0]?.count || 0),
      categories,
    };
  }),

  users: adminQuery
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { page = 1, limit = 10 } = input || {};
      const offset = (page - 1) * limit;

      // Get OAuth users
      const oauthUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);

      const totalOAuth = await db.select({ count: sql<number>`count(*)` }).from(users);

      return {
        items: oauthUsers.map((u) => ({
          id: u.id,
          name: u.name || "Unknown",
          email: u.email || "",
          role: u.role,
          type: "oauth" as const,
          createdAt: u.createdAt,
          lastSignInAt: u.lastSignInAt,
        })),
        total: totalOAuth[0]?.count || 0,
        page,
        limit,
      };
    }),

  recentActivity: adminQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { limit = 20 } = input || {};

      const logs = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit);

      return logs;
    }),

  feedbackList: adminQuery
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(10),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { page = 1, limit = 10 } = input || {};
      const offset = (page - 1) * limit;

      const items = await db
        .select()
        .from(feedback)
        .orderBy(desc(feedback.createdAt))
        .limit(limit)
        .offset(offset);

      const total = await db.select({ count: sql<number>`count(*)` }).from(feedback);

      return {
        items,
        total: total[0]?.count || 0,
        page,
        limit,
      };
    }),

  markFeedbackRead: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(feedback)
        .set({ isRead: true })
        .where(sql`${feedback.id} = ${input.id}`);
      return { success: true };
    }),
});
