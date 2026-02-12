import { Router } from "express";
import { login, changePassword, verifyEmail } from "../controllers/authController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/change-password", requireAuth, changePassword);
authRouter.get("/verify-email", verifyEmail);

export { authRouter };