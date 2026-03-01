import { Router } from "express";
import {
  signupControl,
  loginControl,
  changePSControl,
} from "../controllers/AuthController.js";

const router = Router();

router.post("/signup", signupControl);
router.post("/login", loginControl);
router.post("/change-password", changePSControl);

export default router;
