import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

app.use(errorMiddleware);

export default app;
