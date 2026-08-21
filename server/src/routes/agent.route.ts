import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { agentChat } from "../controllers/agent.controller.js";
import { sendMessageSchema } from "../validations/message.schema.js";
import { verifyUser } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/chat", verifyUser, validate(sendMessageSchema), agentChat);

export default router;
