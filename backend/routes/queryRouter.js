import axios from "axios";
import Router from "express";

// import edgeController from "../controllers/edgeController.js";
const queryRouter = Router();

queryRouter.post("/", async (req, res) => {
  try {
    // send the incoming data to the Python AI service
    const response = await axios.post("http://localhost:8000/query", req.body);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating answer" });
  }
});

export default queryRouter;
