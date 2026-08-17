import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import helmet from "helmet";
import { db } from "./lib/prisma";

const app = express();

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.get("/test", async(req: Request, res: Response) => {
  const notes = await db.note.findMany();

  res.status(200).json({
    data:notes,
    success: true,
    message: "Server is running successfully",
  });
});

app.use(errorMiddleware);

export default app;
