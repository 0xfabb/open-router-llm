import { Router } from "express";
import { chatChoiceLLM, getLLMControl } from "../controllers/LLMController";
const router = Router();

router.get("/my-llms", getLLMControl);
router.post("/chat", chatChoiceLLM);

export default router;
