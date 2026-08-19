import { Request, Response } from "express";
import { runAgent } from "../ai/agent";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

export const agentChat = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body;
  const userId = req.user?.id as string;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await runAgent(userId, message);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        message: result.text,
      },
      "Task executed"
    )
  );
});
