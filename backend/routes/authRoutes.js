import { Router } from "express";
import { login, changePassword, verifyEmail } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/change-password", changePassword);
authRouter.get("/verify-email", verifyEmail);

export { authRouter };
