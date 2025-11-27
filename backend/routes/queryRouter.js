import axios from "axios";
import Router from "express";
import driver from "../db/neo4j.js";

// import edgeController from "../controllers/edgeController.js";
const queryRouter = Router();

queryRouter.post("/", async (req, res) => {
  try {
    // send the incoming data to the Python AI service
    const response = await axios.post("https://query-engine-4avr.onrender.com/query", req.body, { timeout: 120000 });

    const data = response.data;

    const nodeIds = data.node_ids;
    const edgeIds = data.edge_ids;

    // get node and edge data from ids returned by Python backend
    const session = driver.session();
    const result = await session.executeRead((tx) =>
      tx.run(
        `
        MATCH (n)
        WHERE elementId(n) IN $nodeIds
        WITH collect(n) AS nodes
    
        OPTIONAL MATCH ()-[r]->()
        WHERE elementId(r) IN $edgeIds
        RETURN nodes, collect(r) AS edges
        `,
        { nodeIds, edgeIds }
      )
    );

    let nodes;
    let edges;
    if (result.records && result.records.length !== 0) {
      const record = result.records[0];

      nodes = record.has("nodes") ? record.get("nodes") : [];
      edges = record.has("edges") ? record.get("edges") : [];
    }

    const nodeData = nodes.map((node) => {
      const { name, embedding, ...rest } = node.properties;

      return {
        id: node.elementId,
        name: name,
        labels: node.labels,
        properties: rest,
      };
    });

    const edgeData = edges.map((rel) => {
      return {
        id: rel.elementId,
        sourceId: rel.startNodeElementId,
        targetId: rel.endNodeElementId,
        type: rel.type,
        properties: rel.properties,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        answer: data["answer"],
        nodes: nodeData,
        edges: edgeData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating answer" });
  }
});

export default queryRouter;
