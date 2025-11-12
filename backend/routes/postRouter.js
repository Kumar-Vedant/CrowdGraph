import Router from "express";

import postController from "../controllers/postController.js";
const postRouter = Router();

postRouter.get("/:communityId/community", postController.postListGet);
postRouter.get("/:id", postController.postGet);
postRouter.get("/:communityId/search", postController.postSearch);
postRouter.post("/create", postController.postCreate);
postRouter.put("/:id/update", postController.postUpdate);
postRouter.delete("/:id/delete", postController.postDelete);

export default postRouter;
