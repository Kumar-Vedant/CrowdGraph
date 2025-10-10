import Router from "express";

import nodeController from "../controllers/nodeController.js";
const nodeRouter = Router();

nodeRouter.get("/", nodeController.nodeGetAll);
nodeRouter.get("/:id", nodeController.nodeGet);
nodeRouter.get("/search", nodeController.nodeSearch);
nodeRouter.get("/create", nodeController.nodeCreateGet);
nodeRouter.post("/create", nodeController.nodeCreatePost);
nodeRouter.get("/:id/update", nodeController.nodeUpdateGet);
nodeRouter.post("/:id/update", nodeController.nodeUpdatePost);
nodeRouter.post("/:id/delete", nodeController.nodeDeletePost);
nodeRouter.get("/:id/edges", nodeController.nodeRelationsGet);

export default nodeRouter;
