import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { businesses, events } from "@db/schema";
import { eq, and, desc, like, sql } from "drizzle-orm";


export const businessRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          category: z.string().optional(),
          ownerId: z.string().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { search, category, ownerId, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (search) {
        conditions.push(like(businesses.name, `%${search}%`));
      }
      if (category) {
        conditions.push(eq(businesses.category, category));
      }
      if (ownerId) {
        conditions.push(eq(businesses.ownerId, ownerId));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(businesses)
        .where(where)
        .orderBy(desc(businesses.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(businesses)
        .where(where);

      return {
        items,
        total: countResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, input.id))
        .limit(1);

      if (rows.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }

      return rows[0];
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        category: z.string().min(1).max(100),
        description: z.string().max(2000).optional(),
        location: z.string().max(500).optional(),
        phone: z.string().max(50).optional(),
        email: z.string().email().max(320).optional(),
        website: z.string().max(500).optional(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const ownerId = ctx.user.unionId || String(ctx.user.id);
      const ownerType = ctx.user.unionId ? ("oauth" as const) : ("local" as const);

      const result = await db.insert(businesses).values({
        ...input,
        ownerId,
        ownerType,
      });

      const id = Number(result[0].insertId);
      const row = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, id))
        .limit(1);

      return row[0];
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        category: z.string().min(1).max(100).optional(),
        description: z.string().max(2000).optional(),
        location: z.string().max(500).optional(),
        phone: z.string().max(50).optional(),
        email: z.string().email().max(320).optional(),
        website: z.string().max(500).optional(),
        imageUrl: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const ownerId = ctx.user.unionId || String(ctx.user.id);

      const existing = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" });
      }

      if (existing[0].ownerId !== ownerId && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own businesses",
        });
      }

      await db
        .update(businesses)
        .set(data)
        .where(eq(businesses.id, id));

      const row = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, id))
        .limit(1);

      return row[0];
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const ownerId = ctx.user.unionId || String(ctx.user.id);

      const existing = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, input.id))
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" });
      }

      if (existing[0].ownerId !== ownerId && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own businesses",
        });
      }

      // Delete associated events first
      await db.delete(events).where(eq(events.businessId, input.id));
      await db.delete(businesses).where(eq(businesses.id, input.id));

      return { success: true };
    }),

  incrementViews: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(businesses)
        .set({ views: sql`${businesses.views} + 1` })
        .where(eq(businesses.id, input.id));
      return { success: true };
    }),

  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const ownerId = ctx.user.unionId || String(ctx.user.id);

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(businesses)
      .where(eq(businesses.ownerId, ownerId));

    const viewsResult = await db
      .select({ total: sql<number>`COALESCE(SUM(views), 0)` })
      .from(businesses)
      .where(eq(businesses.ownerId, ownerId));

    return {
      total: result[0]?.count || 0,
      totalViews: viewsResult[0]?.total || 0,
    };
  }),
});
