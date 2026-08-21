import { db } from "../lib/prisma.js";

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
    return db.note.update({
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

  async deleteAll(userId: string) {
    return db.note.deleteMany({
      where: {
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

  async search(userId: string, query: string) {
    return db.note.findMany({
      where: {
        userId,
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        content: true,
        isCompleted: true,
      },
    });
  },
};
