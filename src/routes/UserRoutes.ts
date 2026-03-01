import { Router } from "express";
import { getKeyControl } from "../controllers/userController";

const router = Router();

router.get("/get-key", getKeyControl);
router.post("create-key");

export default router;
