import Router from "express";

import communityController from "../controllers/communityController.js";
const communityRouter = Router();

communityRouter.get("/", communityController.communityListGet);
communityRouter.get("/search", communityController.communitySearch);
communityRouter.get("/:id", communityController.communityGet);
communityRouter.get("/:id/users", communityController.communityUsersGet);
communityRouter.post("/:id/:userId", communityController.communityJoinUser);
communityRouter.get("/:id/graph", communityController.communityGraphGet);
communityRouter.get("/:id/forum", communityController.communityForumGet);
communityRouter.post("/create", communityController.communityCreate);
communityRouter.put("/:id/update", communityController.communityUpdate);
communityRouter.delete("/:id/delete", communityController.communityDelete);

export default communityRouter;
