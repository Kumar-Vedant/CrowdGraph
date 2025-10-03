const { Router } = require("express");
const nodeController = require("../controllers/nodeController");
const nodeRouter = Router();

nodeRouter.get("/:id", nodeController.nodeGet);
nodeRouter.get("/search", nodeController.nodeSearch);
nodeRouter.get("/create", nodeController.nodeCreateGet);
nodeRouter.post("/create", nodeController.nodeCreatePost);
nodeRouter.get("/:id/update", nodeController.nodeUpdateGet);
nodeRouter.post("/:id/update", nodeController.nodeUpdatePost);
nodeRouter.post("/:id/delete", nodeController.nodeDeletePost);
nodeRouter.get("/:id/edges", nodeController.nodeRelationsGet);

module.exports = nodeRouter;
