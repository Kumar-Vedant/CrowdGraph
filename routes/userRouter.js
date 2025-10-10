import Router from "express";

import userController from "../controllers/userController.js";
const userRouter = Router();

userRouter.get("/", userController.userListGet);
userRouter.get("/search", userController.userSearch);
userRouter.get("/create", userController.userCreateGet);
userRouter.post("/create", userController.userCreatePost);
userRouter.get("/:id/update", userController.userUpdateGet);
userRouter.post("/:id/update", userController.userUpdatePost);
userRouter.post("/:id/delete", userController.userDeletePost);

export default userRouter;
