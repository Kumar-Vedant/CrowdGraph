import Router from "express";

import userController from "../controllers/userController.js";
const userRouter = Router();

userRouter.get("/", userController.userListGet);
userRouter.get("/search", userController.userSearch);
userRouter.get("/:id", userController.userGet);
userRouter.get("/:id/communities", userController.userCommunitiesGet);
userRouter.post("/create", userController.userCreate);
userRouter.put("/:id/update", userController.userUpdate);
userRouter.delete("/:id/delete", userController.userDelete);

export default userRouter;
