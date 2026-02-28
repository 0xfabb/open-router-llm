import { Router } from "express";
import { getLLMControl } from "../controllers/LLMController";
const router = Router();

router.get("/my-llms", getLLMControl);

export default router;
