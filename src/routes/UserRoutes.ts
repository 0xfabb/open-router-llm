import { Router } from "express";
import { getKeyControl } from "../controllers/userController";
import { loginCheck } from "../middlewares/authCheck";

const router = Router();

router.post("/get-keys", loginCheck, getKeyControl);

export default router;
