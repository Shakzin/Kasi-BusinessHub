import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { events, businesses } from "@db/schema";
import { eq, and, desc, gte, sql, like } from "drizzle-orm";

export const eventRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          businessId: z.number().optional(),
          status: z.string().optional(),
          ownerId: z.string().optional(),
          upcoming: z.boolean().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const {
        search,
        businessId,
        status,
        ownerId,
        upcoming,
        page = 1,
        limit = 20,
      } = input || {};
      const offset = (page - 1) * limit;

      const conditions = [];
      if (search) {
        conditions.push(like(events.title, `%${search}%`));
      }
      if (businessId) {
        conditions.push(eq(events.businessId, businessId));
      }
      if (status) {
        conditions.push(eq(events.status, status as "draft" | "published" | "cancelled"));
      }
      if (upcoming) {
        conditions.push(gte(events.startDate, new Date()));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(events)
        .where(where)
        .orderBy(desc(events.startDate))
        .limit(limit)
        .offset(offset);

      // Enrich with business name if we can
      const enriched = await Promise.all(
        items.map(async (evt) => {
          const bizRows = await db
            .select({ name: businesses.name, ownerId: businesses.ownerId })
            .from(businesses)
            .where(eq(businesses.id, evt.businessId))
            .limit(1);
          const biz = bizRows[0];
          return {
            ...evt,
            businessName: biz?.name || "Unknown",
            businessOwnerId: biz?.ownerId,
          };
        })
      );

      // Filter by ownerId if provided
      let filtered = enriched;
      if (ownerId) {
        filtered = enriched.filter((e) => e.businessOwnerId === ownerId);
      }

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(events)
        .where(where);

      return {
        items: filtered,
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
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1);

      if (rows.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      const bizRows = await db
        .select({ name: businesses.name })
        .from(businesses)
        .where(eq(businesses.id, rows[0].businessId))
        .limit(1);

      return { ...rows[0], businessName: bizRows[0]?.name || "Unknown" };
    }),

  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().max(2000).optional(),
        businessId: z.number(),
        location: z.string().max(500).optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        imageUrl: z.string().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const ownerId = ctx.user.unionId || String(ctx.user.id);

      // Verify business ownership
      const bizRows = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, input.businessId))
        .limit(1);

      if (bizRows.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" });
      }

      if (bizRows[0].ownerId !== ownerId && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only create events for your own businesses",
        });
      }

      const result = await db.insert(events).values({
        title: input.title,
        description: input.description,
        businessId: input.businessId,
        location: input.location,
        startDate: input.startDate,
        endDate: input.endDate,
        imageUrl: input.imageUrl,
        status: input.status,
      });

      const id = Number(result[0].insertId);
      const row = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      return { ...row[0], businessName: bizRows[0].name };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(2000).optional(),
        businessId: z.number().optional(),
        location: z.string().max(500).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        imageUrl: z.string().optional(),
        status: z.enum(["draft", "published", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const ownerId = ctx.user.unionId || String(ctx.user.id);

      const existing = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      // Verify ownership through business
      const bizRows = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, existing[0].businessId))
        .limit(1);

      if (bizRows[0].ownerId !== ownerId && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own events",
        });
      }

      await db.update(events).set(data).where(eq(events.id, id));

      const row = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      return { ...row[0], businessName: bizRows[0]?.name || "Unknown" };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const ownerId = ctx.user.unionId || String(ctx.user.id);

      const existing = await db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      const bizRows = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, existing[0].businessId))
        .limit(1);

      if (bizRows[0].ownerId !== ownerId && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own events",
        });
      }

      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),

  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const ownerId = ctx.user.unionId || String(ctx.user.id);

    // Get all business IDs for this owner
    const bizRows = await db
      .select({ id: businesses.id })
      .from(businesses)
      .where(eq(businesses.ownerId, ownerId));

    const bizIds = bizRows.map((b) => b.id);
    if (bizIds.length === 0) return { total: 0, upcoming: 0 };

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(sql`${events.businessId} IN (${bizIds.join(",")})`);

    const upcomingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(
        and(
          sql`${events.businessId} IN (${bizIds.join(",")})`,
          gte(events.startDate, new Date())
        )
      );

    return {
      total: totalResult[0]?.count || 0,
      upcoming: upcomingResult[0]?.count || 0,
    };
  }),
});
