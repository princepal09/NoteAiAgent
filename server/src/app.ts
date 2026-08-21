import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import helmet from "helmet";
import { db } from "./lib/prisma.js";
import { env } from "./lib/constants.js";
import authRoutes from "./routes/user.route.js";
import agentRoutes from "./routes/agent.route.js";
import noteRoutes from "./routes/note.route.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/agent", agentRoutes);
app.use("/api/v1/note", noteRoutes);

app.get("/", async (req: Request, res: Response) => {
  const notes = await db.note.findMany();

  res.status(200).json({
    data: notes,
    success: true,
    message: "Server is running successfully",
  });
});

app.use(errorMiddleware);

export default app;
