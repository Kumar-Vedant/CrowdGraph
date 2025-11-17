import Router from "express";

import nodeController from "../controllers/nodeController.js";
const nodeRouter = Router();

nodeRouter.get("/", nodeController.nodeGetAll);
nodeRouter.get("/:id", nodeController.nodeGet);
nodeRouter.get("/:communityId/search", nodeController.nodeSearch);
nodeRouter.get("/:communityId/proposal", nodeController.nodeProposalCommunityGet);
nodeRouter.post("/create", nodeController.nodeCreate);
nodeRouter.post("/proposal", nodeController.nodeProposalCreate);
nodeRouter.post("/proposal/vote", nodeController.nodeProposalVote);
nodeRouter.put("/:id/update", nodeController.nodeUpdate);
nodeRouter.delete("/:id/delete", nodeController.nodeDelete);
nodeRouter.get("/:id/edges", nodeController.nodeRelationsGet);

export default nodeRouter;
