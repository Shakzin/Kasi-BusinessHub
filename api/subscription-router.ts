import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { subscriptions } from "@db/schema";
import { eq } from "drizzle-orm";

// Plan configuration (matches frontend)
const PLANS = {
  starter: { name: "Starter", priceId: "price_starter", monthly: 9, yearly: 86 },
  professional: { name: "Professional", priceId: "price_professional", monthly: 29, yearly: 278 },
  enterprise: { name: "Enterprise", priceId: "price_enterprise", monthly: 99, yearly: 950 },
};

export const subscriptionRouter = createRouter({
  plans: publicQuery.query(() => {
    return PLANS;
  }),

  mySubscription: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.unionId || String(ctx.user.id);

    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(subscriptions.createdAt)
      .limit(1);

    return rows[0] || null;
  }),

  createCheckout: authedQuery
    .input(
      z.object({
        plan: z.enum(["starter", "professional", "enterprise"]),
        billing: z.enum(["monthly", "yearly"]).default("monthly"),
      })
    )
    .mutation(async ({ input }) => {
      // For demo, return a mock checkout URL since we don't have real Stripe keys
      const plan = PLANS[input.plan];
      const amount = input.billing === "yearly" ? plan.yearly : plan.monthly;

      // In production, this would create a real Stripe CheckoutSession
      return {
        url: `/subscription?plan=${input.plan}&billing=${input.billing}&amount=${amount}&success=true`,
        plan: input.plan,
        billing: input.billing,
        amount,
      };
    }),

  subscribe: authedQuery
    .input(
      z.object({
        plan: z.enum(["starter", "professional", "enterprise"]),
        billing: z.enum(["monthly", "yearly"]).default("monthly"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.unionId || String(ctx.user.id);
      const userType = ctx.user.unionId ? ("oauth" as const) : ("local" as const);
      const plan = PLANS[input.plan];

      // Check for existing active subscription
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      const now = new Date();
      const periodEnd = new Date(now);
      if (input.billing === "yearly") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      if (existing.length > 0) {
        // Update existing
        await db
          .update(subscriptions)
          .set({
            planName: plan.name,
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
          })
          .where(eq(subscriptions.id, existing[0].id));

        const updated = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.id, existing[0].id))
          .limit(1);

        return updated[0];
      }

      // Create new
      const result = await db.insert(subscriptions).values({
        userId,
        userType,
        planName: plan.name,
        stripePriceId: plan.priceId,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      });

      const id = Number(result[0].insertId);
      const row = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, id))
        .limit(1);

      return row[0];
    }),

  cancel: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.unionId || String(ctx.user.id);

    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      return { success: false, message: "No active subscription found" };
    }

    await db
      .update(subscriptions)
      .set({
        status: "cancelled",
        cancelAtPeriodEnd: true,
      })
      .where(eq(subscriptions.id, existing[0].id));

    return { success: true };
  }),
});
