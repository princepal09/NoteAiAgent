import express from "express";
import { registerUser } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerUserSchema } from "../validations/auth.schema";
const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);

export default router;
