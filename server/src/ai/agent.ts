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
    model: google("gemini-2.5-flash"),

    system: `
You are an AI Note Assistant.

You can perform these actions:
- Create a note
- Update a note
- Delete a note

Rules:
- Use the available tools when the user wants to perform an action.
- Never invent a note ID.
- Only use the tools provided to you.
- After a tool executes, clearly explain the result to the user.
`,

    prompt: message,

    tools,

    stopWhen: stepCountIs(5),
  });

  return result;
};
