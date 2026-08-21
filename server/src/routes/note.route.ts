import express from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { getAllNotes } from "../controllers/note.controller.js";

const router = express.Router();

router.get("/all-notes", verifyUser, getAllNotes);

export default router;
    