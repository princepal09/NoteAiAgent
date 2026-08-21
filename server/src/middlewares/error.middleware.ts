import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const statusCode =
    err instanceof ApiError ? err.status : 500;

  const message =
    err instanceof ApiError
      ? err.message
      : "Internal Server Error";

  const errors =
    err instanceof ApiError ? err.errors : [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

export default errorMiddleware;