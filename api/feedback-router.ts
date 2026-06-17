import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { feedback } from "@db/schema";

export const feedbackRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        type: z.enum(["suggestion", "bug", "praise", "other"]).default("suggestion"),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(feedback).values(input);
      return { id: Number(result[0].insertId), success: true };
    }),
});
