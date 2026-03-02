import { Router } from "express";
import { createKeyControl, getKeyControl } from "../controllers/userController";
import { loginCheck } from "../middlewares/authCheck";

const router = Router();

router.post("/get-keys", loginCheck, getKeyControl);
router.post("/create-key", loginCheck, createKeyControl);

export default router;
