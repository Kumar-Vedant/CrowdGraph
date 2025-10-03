const { Router } = require("express");
const userController = require("../controllers/userController");
const userRouter = Router();

userRouter.get("/", userController.userListGet);
userRouter.get("/search", userController.userSearch);
userRouter.get("/create", userController.userCreateGet);
userRouter.post("/create", userController.userCreatePost);
userRouter.get("/:id/update", userController.userUpdateGet);
userRouter.post("/:id/update", userController.userUpdatePost);
userRouter.post("/:id/delete", userController.userDeletePost);

module.exports = userRouter;
