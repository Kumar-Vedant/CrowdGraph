import Router from "express";

import postController from "../controllers/postController.js";
const postRouter = Router();

postRouter.get("/:communityId", postController.postListGet);
postRouter.get("/:id", postController.postGet);
postRouter.get("/:communityId/search", postController.postSearch);
postRouter.get("/create", postController.postCreateGet);
postRouter.post("/create", postController.postCreatePost);
postRouter.get("/:id/update", postController.postUpdateGet);
postRouter.post("/:id/update", postController.postUpdatePost);
postRouter.post("/:id/delete", postController.postDeletePost);

export default postRouter;
