import { Router } from "express";
import { getLLMControl } from "../controllers/LLMController.js";
const router = Router();

router.get("/my-llms", getLLMControl);

export default router;
