import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { comparePassword, encyrptPassword } from "../utils/auth/hash.js";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/jwt.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/auth/helper.js";
import ApiResponse from "../utils/ApiResponse.js";

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
  res.clearCookie("accessToken", accessTokenCookieOptions);

  res.clearCookie("refreshToken", refreshTokenCookieOptions);

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

// export const refreshAccessToken = asyncHandler(
//   async (req: Request, res: Response) => {

//     const refreshToken = req.cookies?.refreshToken;

//     if (!refreshToken) {
//       throw new ApiError(
//         401,
//         "Refresh token not found. Please login again."
//       );
//     }

//     try {
//       const decoded = verifyRefreshToken(refreshToken) as {
//         id: string;
//         email: string;
//         name: string;
//       };

//       const user = await db.user.findUnique({
//         where: {
//           id: decoded.id,
//         },
//         select: {
//           id: true,
//           email: true,
//           name: true,
//         },
//       });

//       if (!user) {
//         throw new ApiError(401, "User no longer exists");
//       }

//       const payload = {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//       };

//       const newAccessToken = generateAccessToken(payload);

//       if (!newAccessToken) {
//         throw new ApiError(500, "Failed to generate access token");
//       }

//       const newRefreshToken = generateRefreshToken(payload);

//       if (!newRefreshToken) {
//         throw new ApiError(500, "Failed to generate refresh token");
//       }

//       setAuthCookies(res, newAccessToken, newRefreshToken);

//       return res
//         .status(200)
//         .json(
//           new ApiResponse(
//             200,
//             null,
//             "Access token refreshed successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Refresh token error:", error);

//       res.clearCookie("accessToken");
//       res.clearCookie("refreshToken");

//       if (error instanceof ApiError) {
//         throw error;
//       }

//       throw new ApiError(
//         401,
//         "Invalid or expired refresh token. Please login again."
//       );
//     }
//   }
// );
