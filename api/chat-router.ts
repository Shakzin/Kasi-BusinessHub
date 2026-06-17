import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatMessages } from "@db/schema";
import { eq } from "drizzle-orm";

export const chatRouter = createRouter({
  history: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(chatMessages.createdAt)
        .limit(50);

      return messages;
    }),

  send: publicQuery
    .input(
      z.object({
        sessionId: z.string(),
        message: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Store user message
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "user",
        content: input.message,
      });

      // Generate contextual response based on the query
      const userMsg = input.message.toLowerCase();
      let response = "";

      if (userMsg.includes("business") && userMsg.includes("create")) {
        response =
          "To create a business, go to the **My Businesses** page and click the **+ Add Business** button. You'll need to provide a name, category, and description. You can also add contact details, location, and a cover image.";
      } else if (userMsg.includes("event") && userMsg.includes("create")) {
        response =
          "To create an event, navigate to **My Events** and click **+ Create Event**. You'll need to select one of your businesses, add a title, description, date/time, and location. Events can be saved as drafts or published immediately.";
      } else if (userMsg.includes("plan") || userMsg.includes("pricing") || userMsg.includes("subscribe")) {
        response =
          "We offer three plans: **Starter** ($9/mo - 1 business, 5 events), **Professional** ($29/mo - 5 businesses, unlimited events), and **Enterprise** ($99/mo - unlimited everything). Visit the **Subscription** page to choose a plan.";
      } else if (userMsg.includes("cancel")) {
        response =
          "You can cancel your subscription from the **Subscription** page. Your access will continue until the end of your current billing period.";
      } else if (userMsg.includes("upgrade")) {
        response =
          "To upgrade your plan, go to the **Subscription** page and select a higher tier. Your new plan will take effect immediately.";
      } else if (userMsg.includes("delete") || userMsg.includes("remove")) {
        response =
          "To delete a business or event, find it in your list and click the trash icon. Deleting a business will also remove all associated events. This action cannot be undone.";
      } else if (userMsg.includes("help") || userMsg.includes("support")) {
        response =
          "I'm here to help! You can ask me about creating businesses, managing events, subscription plans, or account settings. For technical issues, please use the feedback form in your sidebar.";
      } else if (userMsg.includes("image") || userMsg.includes("photo")) {
        response =
          "When creating or editing a business/event, you can add a cover image by providing an image URL. We recommend using high-quality images with a 16:9 aspect ratio for the best results.";
      } else if (userMsg.includes("analytics") || userMsg.includes("view")) {
        response =
          "Your **Dashboard** shows key metrics including total businesses, events, and views. Professional and Enterprise plans include advanced analytics.";
      } else if (userMsg.includes("hello") || userMsg.includes("hi")) {
        response =
          "Hello! Welcome to BusinessHub. I'm your AI assistant. How can I help you today? I can answer questions about businesses, events, subscriptions, and more.";
      } else {
        response =
          "Thanks for your message! I can help with questions about managing your businesses, creating events, understanding subscription plans, or navigating the platform. What would you like to know?";
      }

      // Store assistant response
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "assistant",
        content: response,
      });

      return { response };
    }),

  clear: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(chatMessages).where(eq(chatMessages.sessionId, input.sessionId));
      return { success: true };
    }),
});
