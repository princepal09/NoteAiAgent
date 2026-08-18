import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerUserSchema, loginUserSchema } from "../validations/auth.schema";
const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/register", validate(loginUserSchema), loginUser);

export default router;
