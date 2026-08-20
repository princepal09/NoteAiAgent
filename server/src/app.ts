import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import helmet from "helmet";
import { db } from "./lib/prisma";
import { env } from "./lib/constants";
import authRoutes from "../src/routes/user.route";
import agentRoutes from "../src/routes/agent.route"

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials:true
  })
);
app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/agent", agentRoutes);

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
