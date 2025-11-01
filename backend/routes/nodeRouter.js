import Router from "express";

import nodeController from "../controllers/nodeController.js";
const nodeRouter = Router();

nodeRouter.get("/", nodeController.nodeGetAll);
nodeRouter.get("/:id", nodeController.nodeGet);
nodeRouter.get("/search", nodeController.nodeSearch);
nodeRouter.post("/create", nodeController.nodeCreate);
nodeRouter.put("/:id/update", nodeController.nodeUpdate);
nodeRouter.delete("/:id/delete", nodeController.nodeDelete);
nodeRouter.get("/:id/edges", nodeController.nodeRelationsGet);

export default nodeRouter;
