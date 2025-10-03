const { Router } = require("express");
const edgeRouter = require("../controllers/edgeController");
const edgeRouter = Router();

edgeRouter.get("/:id", edgeController.edgeGet);
edgeRouter.get("/create", edgeController.edgeCreateGet);
edgeRouter.post("/create", edgeController.edgeCreatePost);
edgeRouter.get("/:id/update", edgeController.edgeUpdateGet);
edgeRouter.post("/:id/update", edgeController.edgeUpdatePost);
edgeRouter.post("/:id/delete", edgeController.edgeDeletePost);

module.exports = edgeRouter;
