import { Router } from "express";
import { login, changePassword } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/change-password", changePassword);

export { authRouter };
