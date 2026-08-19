import { db } from "../lib/prisma";

export const noteService = {
  async create(userId: string, content: string) {
    return db.note.create({
      data: {
        content,
        userId,
      },
    });
  },

  async update(noteId: string, userId: string, content: string) {
    return db.note.updateMany({
      where: {
        id: noteId,
        userId,
      },
      data: {
        content,
      },
    });
  },

  async markCompleted(noteId: string, userId: string) {
    return db.note.updateMany({
      where: {
        id: noteId,
        userId,
      },
      data: {
        isCompleted: true,
      },
    });
  },

  async delete(noteId: string, userId: string) {
    return db.note.deleteMany({
      where: {
        id: noteId,
        userId,
      },
    });
  },

  async getAll(userId: string) {
    return db.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
