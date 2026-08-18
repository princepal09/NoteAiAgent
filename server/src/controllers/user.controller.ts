import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { encyrptPassword } from "../utils/auth/hash";
import { generateAccessToken } from "../utils/auth/jwt";
import { setAuthCookies } from "../utils/auth/helper";
import ApiResponse from "../utils/ApiResponse";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const isExists = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isExists) {
      throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await encyrptPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    const payload = {
      id: user.id,
      email,
      name: user.name,
    };
    const accessToken = generateAccessToken(payload);

    if (!accessToken) {
      throw new ApiError(5000, "Error while creating the accessToken");
    }
    const refreshToken = generateAccessToken(payload);
    if (!refreshToken) {
      throw new ApiError(5000, "Error while creating the accessToken");
    }

    setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User Created Successfully!"));
  }
);
