export const noteTools = [
  {
    name: "create_note",
    description: "Create a new note",
  },

  {
    name: "search_note",
    description:
      "Search the user's notes by content. Use this to find note IDs before updating or deleting a note.",
  },
  {
    name: "mark_note_completed",
    description:
      "Mark a single note as completed using its note ID. Use search_note first if the note ID is unknown.",
  },

  {
    name: "update_note",
    description: "Update an existing note using its note ID",
  },

  {
    name: "delete_note",
    description: "Delete a single note using its note ID",
  },

  {
    name: "delete_all_notes",
    description:
      "Delete all notes belonging to the current user. Use only when the user explicitly asks to delete all, remove all, or clear all notes.",
  },
];
