import Router from "express";

import commentController from "../controllers/commentController.js";
const commentRouter = Router();

commentRouter.get("/:id", commentController.commentGet);
commentRouter.get("/:id/replies", commentController.commentRepliesGet);
commentRouter.get("/:id/post", commentController.commentsInPostGet);
commentRouter.post("/create", commentController.commentCreate);
commentRouter.put("/:id/update", commentController.commentUpdate);
commentRouter.delete("/:id/delete", commentController.commentDelete);

export default commentRouter;
