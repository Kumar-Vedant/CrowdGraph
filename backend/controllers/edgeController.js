import driver from "../db/neo4j.js";
import { recomputeNodeEmbedding } from "../utils/embedding.js";

const edgeGet = async (req, res) => {
  const session = driver.session();
  const { id } = req.params;

  try {
    // fetch the relationship and the connected nodes
    const query = `
      MATCH (a)-[r]->(b)
      WHERE elementId(r) = $relId
      RETURN r, a, b
    `;

    const result = await session.executeRead((tx) => tx.run(query, { relId: id }));

    if (result.records.length === 0) {
      return res.status(404).send("Relationship not found");
    }

    const record = result.records[0];
    const rel = record.get("r");
    const nodeA = record.get("a");
    const nodeB = record.get("b");

    return res.status(200).json({
      relationship: {
        elementId: rel.elementId,
        type: rel.type,
        properties: rel.properties,
      },
      nodes: [
        {
          elementId: nodeA.elementId,
          labels: nodeA.labels,
          properties: nodeA.properties,
        },
        {
          elementId: nodeB.elementId,
          labels: nodeB.labels,
          properties: nodeB.properties,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching relationship");
  } finally {
    await session.close();
  }
};

const edgeCreate = async (req, res) => {
  const session = driver.session();
  const { sourceId, targetId, type, properties } = req.body;

  if (!sourceId || !targetId || !type) {
    return res.status(400).send("sourceId, targetId, and type are required");
  }

  // sanitize relationship type
  const relType = type.replace(/[^A-Za-z0-9_]/g, "");
  if (!relType) return res.status(400).send("Invalid relationship type");

  try {
    // create relationship
    const createQuery = `
      MATCH (a), (b)
      WHERE elementId(a) = $sourceId AND elementId(b) = $targetId
      CREATE (a)-[r:${relType} $props]->(b)
      RETURN r
    `;

    const result = await session.executeWrite((tx) => tx.run(createQuery, { sourceId, targetId, props: properties || {} }));

    if (result.records.length === 0) return res.status(404).send("Nodes not found");

    const record = result.records[0];
    const rel = record.get("r");

    // recompute embeddings for both nodes
    await Promise.all([recomputeNodeEmbedding(sourceId), recomputeNodeEmbedding(targetId)]);

    return res.status(201).send(rel);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error creating relationship");
  } finally {
    await session.close();
  }
};

const edgeUpdate = async (req, res) => {
  const session = driver.session();
  const { id } = req.params;
  const { properties } = req.body;

  try {
    // update properties of the relationship
    const updateQuery = `
      MATCH ()-[r]->()
      WHERE elementId(r) = $relId
      SET r += $props
      RETURN r
    `;

    const updatedRelResult = await session.executeWrite((tx) => tx.run(updateQuery, { relId: id, props: properties || {} }));

    if (updatedRelResult.records.length === 0) {
      return res.status(404).send("Relationship not found");
    }

    const updatedRel = updatedRelResult.records[0].get("r");

    return res.status(200).send(updatedRel);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error updating relationship");
  } finally {
    await session.close();
  }
};

const edgeDelete = async (req, res) => {
  const session = driver.session();
  const { id } = req.params;

  try {
    // delete the relationship
    const deleteQuery = `
      MATCH ()-[r]->()
      WHERE elementId(r) = $relId
      DELETE r
      RETURN startNode(r) AS a, endNode(r) AS b
    `;
    const deleteResult = await session.run(deleteQuery, { relId: id });

    if (deleteResult.records.length === 0) return res.status(404).send("No such relationship found");

    const sourceId = deleteResult.records[0].get("a").elementId;
    const targetId = deleteResult.records[0].get("b").elementId;

    // recompute embeddings for both nodes
    await Promise.all([recomputeNodeEmbedding(sourceId), recomputeNodeEmbedding(targetId)]);

    res.status(200).send(`Relationship with id ${id} deleted successfully`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error deleting relationship");
  } finally {
    await session.close();
  }
};

export default {
  edgeGet,
  edgeCreate,
  edgeUpdate,
  edgeDelete,
};
