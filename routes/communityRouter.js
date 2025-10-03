const { Router } = require("express");
const communityController = require("../controllers/communityController");
const communityRouter = Router();

communityRouter.get("/", communityController.communityListGet);
communityRouter.get("/search", communityController.communitySearch);
communityRouter.get("/:id", communityController.communityGet);
communityRouter.get("/:id/users", communityController.communityUsersGet);
communityRouter.get("/:id/graph", communityController.communityGraphGet);
communityRouter.get("/:id/forum", communityController.communityForumGet);
communityRouter.get("/create", communityController.communityCreateGet);
communityRouter.post("/create", communityController.communityCreatePost);
communityRouter.get("/:id/update", communityController.communityUpdateGet);
communityRouter.post("/:id/update", communityController.communityUpdatePost);
communityRouter.post("/:id/delete", communityController.communityDeletePost);

module.exports = communityRouter;
