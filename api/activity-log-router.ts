import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { activityLogs } from "@db/schema";
import { desc, sql } from "drizzle-orm";

export const activityLogRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          userId: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
          page: z.number().min(1).default(1),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { limit = 20, page = 1 } = input || {};
      const offset = (page - 1) * limit;

      const items = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(activityLogs);

      return {
        items,
        total: countResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  create: publicQuery
    .input(
      z.object({
        userId: z.string().optional(),
        userName: z.string().optional(),
        action: z.string().min(1),
        entityType: z.string().min(1),
        entityId: z.string().optional(),
        entityName: z.string().optional(),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(activityLogs).values(input);
      return { id: Number(result[0].insertId), success: true };
    }),
});
