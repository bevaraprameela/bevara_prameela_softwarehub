import { Router } from "express";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import { sendMessage, conversation, listThreads, markRead } from "../controllers/messages.controller.js";

const router = Router();

router.use(auth);

router.post("/", [body("receiverId").notEmpty(), body("text").notEmpty()], sendMessage);
router.get("/threads", listThreads);
router.get("/:otherUserId", conversation);
router.put("/:otherUserId/read", markRead);

export default router;
