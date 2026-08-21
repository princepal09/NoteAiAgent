import { User } from "../../src/generated/prisma/client.js"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        createdAt : Date;
      };
    }
  }
}

export {};

export {};