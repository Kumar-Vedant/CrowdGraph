import Router from "express";

import edgeController from "../controllers/edgeController.js";
const edgeRouter = Router();

edgeRouter.get("/:id", edgeController.edgeGet);
edgeRouter.post("/create", edgeController.edgeCreate);
edgeRouter.put("/:id/update", edgeController.edgeUpdate);
edgeRouter.delete("/:id/delete", edgeController.edgeDelete);

export default edgeRouter;
