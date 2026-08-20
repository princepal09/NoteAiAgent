import express from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import { getAllNotes } from "../controllers/note.controller";

const router = express.Router();

router.get("/all-notes", verifyUser, getAllNotes);

export default router;
    