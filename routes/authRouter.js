const { Router } = require("express");
const authController = require("../controllers/authController");
const authRouter = Router();

authRouter.get("/register", authController.register);
authRouter.get("/login", authController.login);

module.exports = authRouter;
