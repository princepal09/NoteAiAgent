import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { comparePassword, encyrptPassword } from "../utils/auth/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/jwt";
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
      email: user.email,
      name: user.name,
    };
    const accessToken = generateAccessToken(payload);

    if (!accessToken) {
      throw new ApiError(5000, "Error while creating the accessToken");
    }
    const refreshToken = generateRefreshToken(payload);
    if (!refreshToken) {
      throw new ApiError(5000, "Error while creating the accessToken");
    }

    setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User Created Successfully!"));
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "User with this email doesn't found, Please signup"
    );
  }

  const pwdMatch = await comparePassword(password, user.password);

  if (!pwdMatch) {
    throw new ApiError(401, "Password doesn't match");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const accessToken = generateAccessToken(payload);

  if (!accessToken) {
    throw new ApiError(500, "Error while creating the accessToken");
  }
  const refreshToken = generateRefreshToken(payload);
  if (!refreshToken) {
    throw new ApiError(500, "Error while creating the accessToken");
  }

  setAuthCookies(res, accessToken, refreshToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id: user.id, email: user.email, name: user.name },
        "Login Successfully"
      )
    );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(400, "Not authorized");
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetch successfully"));
  }
);

export const changePwd = asyncHandler(async (req: Request, res: Response) => {
  const { currentPwd, newPwd } = req.body;

  if (!currentPwd || !newPwd) {
    throw new ApiError(400, "Bad Request, currentPwd and newPwd is required");
  }
});
