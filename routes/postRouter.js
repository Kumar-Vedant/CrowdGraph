const { Router } = require("express");
const postController = require("../controllers/postController");
const postRouter = Router();

postRouter.get("/:communityId", postController.postListGet);
postRouter.get("/:id", postController.postGet);
postRouter.get("/:communityId/search", postController.postSearch);
postRouter.get("/create", postController.postCreateGet);
postRouter.post("/create", postController.postCreatePost);
postRouter.get("/:id/update", postController.postUpdateGet);
postRouter.post("/:id/update", postController.postUpdatePost);
postRouter.post("/:id/delete", postController.postDeletePost);

module.exports = postRouter;
