import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/auth.schema";
const router = express.Router();

router.post("/auth/register", validate(registerUserSchema), registerUser);
router.post("/auth/login", validate(loginUserSchema), loginUser);

export default router;
