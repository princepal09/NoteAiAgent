import { User } from "../../generated/prisma/client"

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