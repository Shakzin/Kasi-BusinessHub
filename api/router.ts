import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { businessRouter } from "./business-router";
import { eventRouter } from "./event-router";
import { subscriptionRouter } from "./subscription-router";
import { adminRouter } from "./admin-router";
import { activityLogRouter } from "./activity-log-router";
import { feedbackRouter } from "./feedback-router";
import { chatRouter } from "./chat-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  business: businessRouter,
  event: eventRouter,
  subscription: subscriptionRouter,
  admin: adminRouter,
  activityLog: activityLogRouter,
  feedback: feedbackRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
