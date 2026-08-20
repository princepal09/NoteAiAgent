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

        case "search_note":
          return [
            noteTool.name,
            tool({
              description: noteTool.description,

              inputSchema: z.object({
                query: z.string(),
              }),

              execute: async ({ query }) => {
                return await noteService.search(userId, query);
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
        case "mark_note_completed":
          return [
            noteTool.name,
            tool({
              description: noteTool.description,

              inputSchema: z.object({
                noteId: z.string(),
              }),

              execute: async ({ noteId }) => {
                return await noteService.markCompleted(noteId, userId);
              },
            }),
          ];

        case "delete_all_notes":
          return [
            noteTool.name,
            tool({
              description: noteTool.description,

              inputSchema: z.object({}),

              execute: async () => {
                return await noteService.deleteAll(userId);
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

Your job is to manage notes using tools.

Available tools:

- create_note
- search_note
- update_note
- delete_note
- mark_note_completed
- delete_all_notes

RULES:

1. CREATE NOTES

When the user wants to create, save, add, or remember something,
use create_note.


2. SEARCH NOTES

When the user wants to search, find, or look for a note,
use search_note.


3. UPDATE NOTES

When the user wants to update or modify a note:

- If a note ID is provided, use update_note.
- If no note ID is provided:

  FIRST use search_note.
  THEN use update_note with the returned note ID.

Never invent a note ID.


4. DELETE ONE NOTE

When the user wants to delete one specific note:

- If a note ID is provided, use delete_note.
- If no note ID is provided:

  FIRST use search_note.
  THEN use delete_note using the returned note ID.

Never invent a note ID.


5. MARK NOTE AS COMPLETED

When the user asks to:

- mark a note as completed
- mark a note as done
- complete a note
- finish a task

If a note ID is provided:

use mark_note_completed.

If no note ID is provided:

FIRST use search_note.

Then use mark_note_completed with the returned note ID.

Never invent a note ID.


6. DELETE ALL NOTES

Only use delete_all_notes when the user explicitly asks to:

- delete all notes
- remove all notes
- clear all notes

Do not use delete_all_notes for deleting one note.


7. MULTIPLE SEARCH RESULTS

If search_note returns multiple notes and it is not clear which note
the user means, do not randomly select one.

Ask the user which note they want.


8. After successfully executing a tool, provide a short confirmation.
`,

    prompt: message,

    tools,

    stopWhen: stepCountIs(10),
  });

  return result;
};
