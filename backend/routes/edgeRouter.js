import Router from "express";

import edgeController from "../controllers/edgeController.js";
const edgeRouter = Router();

edgeRouter.get("/:id", edgeController.edgeGet);
edgeRouter.get("/:communityId/proposal", edgeController.edgeProposalCommunityGet);
edgeRouter.post("/create", edgeController.edgeCreate);
edgeRouter.post("/proposal", edgeController.edgeProposalCreate);
edgeRouter.post("/proposal/vote", edgeController.edgeProposalVote);
edgeRouter.put("/:id/update", edgeController.edgeUpdate);
edgeRouter.delete("/:id/delete", edgeController.edgeDelete);

export default edgeRouter;
