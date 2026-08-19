import { generateText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { noteTools } from "./tools";
import { noteService } from "../services/note.service";

export const runAgent = async (userId: string, message: string) => {
  const tools = Object.fromEntries(
    noteTools.map((noteTool) => {
      switch (noteTool.name) {
        case "create_note":
          return [
            noteTool.name,
            tool({
              description: noteTool.description,

              inputSchema: z.object({
                content: z.string(),
              }),

              execute: async ({ content }) => {
                return await noteService.create(userId, content);
              },
            }),
          ];

        case "update_note":
          return [
            noteTool.name,
            tool({
              description: noteTool.description,

              inputSchema: z.object({
                noteId: z.string(),
                content: z.string(),
              }),

              execute: async ({ noteId, content }) => {
                return await noteService.update(noteId, userId, content);
              },
            }),
          ];

        case "delete_note":
          return [
            noteTool.name,
            tool({
              description: noteTool.description,

              inputSchema: z.object({
                noteId: z.string(),
              }),

              execute: async ({ noteId }) => {
                return await noteService.delete(noteId, userId);
              },
            }),
          ];

        default:
          throw new Error(`Unknown tool: ${noteTool.name}`);
      }
    })
  );

  const result = await generateText({
    model: google("gemini-3.5-flash-lite"),

    system: `
You are an AI Note Assistant.

Your primary job is to manage notes using the available tools.

You have these actions:
- create_note
- update_note
- delete_note

IMPORTANT RULES:

- When the user asks to create, save, add, remember, or make a note, you MUST call create_note.
- When the user asks to modify or change a note, you MUST call update_note.
- When the user asks to remove or delete a note, you MUST call delete_note.
- Do not just tell the user that you can create a note.
- If a user's message contains information that they want to save as a note, use create_note.
- Never invent a note ID.
- Only use the available tools for note operations.

After executing a tool, provide a short confirmation.
`,

    prompt: message,

    tools,

    stopWhen: stepCountIs(5),
  });

  return result;
};
