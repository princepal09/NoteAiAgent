import { z } from "zod";

export const sendMessageSchema = z
  .object({
    message: z.string().min(1, "Message cannot be empty"),
  })
  .strict();

export type MessageInput = z.infer<typeof sendMessageSchema>;
