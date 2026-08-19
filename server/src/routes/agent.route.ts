import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { agentChat } from "../controllers/agent.controller";
import { sendMessageSchema } from "../validations/message.schema";
import { verifyUser } from "../middlewares/auth.middleware";


const router = express.Router();

router.post("/chat", verifyUser, validate(sendMessageSchema), agentChat);

export default router;
