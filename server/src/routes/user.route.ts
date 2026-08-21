import express from "express";
import {
  getCurrentUser,
  loginUser,
  logout,
  registerUser,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/auth.schema";
import { verifyUser } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.post("/logout", verifyUser, logout);
router.get("/currentUser", verifyUser, getCurrentUser);
// router.post("/refresh", refreshAccessToken);

export default router;
