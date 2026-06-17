import { relations } from "drizzle-orm";
import { businesses, events } from "./schema";

export const businessesRelations = relations(businesses, ({ many }) => ({
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  business: one(businesses, {
    fields: [events.businessId],
    references: [businesses.id],
  }),
}));
