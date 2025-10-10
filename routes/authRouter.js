import Router from "express";
import authController from "../controllers/authController.js";
const authRouter = Router();

authRouter.get("/register", authController.register);
authRouter.get("/login", authController.login);

export default authRouter;
