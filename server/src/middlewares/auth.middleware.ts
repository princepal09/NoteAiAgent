import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../lib/constants";
import { db } from "../lib/prisma";

export interface MyJwtPayload extends JwtPayload {
  id: string;
}
export const verifyUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized: Access Token is Missing");
    }

    const decoded: string | jwt.JwtPayload = jwt.verify(
      accessToken,
      env.JWT_TOKEN_ACCESS_SECRET
    ) as MyJwtPayload;

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },

      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid access token - User not found"));
    }

    req.user = user;

    return next();
  }
);
