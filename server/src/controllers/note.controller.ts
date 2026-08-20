import { Request, Response } from "express";
import { noteService } from "../services/note.service";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";

export const getAllNotes = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const notes = await noteService.getAll(req.user.id);

  return res.status(200).json(
    new ApiResponse(200, notes, "Notes fetched successfully")
  )
});
