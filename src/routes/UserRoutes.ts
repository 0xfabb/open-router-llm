import { Router } from "express";
import { getKeyControl } from "../controllers/userController";
import { loginCheck } from "../middlewares/authCheck";

const router = Router();

router.get("/get-key", loginCheck, getKeyControl);
router.post("create-key");

export default router;
