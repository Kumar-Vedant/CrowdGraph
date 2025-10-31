import driver from "../db/neo4j.js";
import { recomputeNodeEmbedding } from "../utils/embedding.js";

const nodeGetAll = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.executeRead((tx) => tx.run("MATCH (n) RETURN n"));

    const nodes = result.records.map((record) => {
      const node = record.get("n");
      return {
        id: node.elementId,
        labels: node.labels,
        properties: node.properties,
      };
    });

    res.status(200).send(nodes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching nodes");
  } finally {
    await session.close();
  }
};

const nodeGet = async (req, res) => {
  const { id } = req.params;
  const session = driver.session();

  try {
    const result = await session.executeRead((tx) => tx.run(`MATCH (n) WHERE elementId(n) = $id RETURN n`, { id }));

    if (result.records.length === 0) {
      return res.status(404).send("Node not found");
    }

    const node = result.records[0].get("n");
    const nodeData = {
      id: node.elementId,
      labels: node.labels,
      properties: node.properties,
    };

    res.status(200).send(nodeData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching node");
  } finally {
    await session.close();
  }
};

const nodeSearch = async (req, res) => {};

const nodeCreateGet = async (req, res) => {};

const nodeCreatePost = async (req, res) => {
  const session = driver.session();
  const { labels, properties } = req.body;

  if (!Array.isArray(labels) || labels.length === 0) {
    return res.status(400).send("At least one label required");
  }

  // sanitize labels (to prevent Cypher injection)
  const sanitizedLabels = labels.map((l) => l.replace(/[^A-Za-z0-9_]/g, "")).filter(Boolean);
  if (sanitizedLabels.length === 0) {
    return res.status(400).send("At least one valid label required");
  }
  const labelString = sanitizedLabels.map((l) => `:${l}`).join("") + ":Searchable";

  try {
    const query = `
      CREATE (n${labelString} $props)
      RETURN elementId(n) AS nodeId, n AS node
    `;
    const result = await session.executeWrite((tx) => tx.run(query, { props: properties }));

    if (result.records.length === 0) {
      return res.status(500).send("Failed to create node");
    }

    const record = result.records[0];
    const nodeId = record.get("nodeId");
    const node = record.get("node");

    // compute embedding
    await recomputeNodeEmbedding(nodeId);

    return res.status(201).json({
      id: node.elementId,
      labels: node.labels,
      properties: node.properties,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error creating node");
  } finally {
    await session.close();
  }
};

const nodeUpdateGet = async (req, res) => {};

const nodeUpdatePost = async (req, res) => {
  const session = driver.session();
  const { id } = req.params;
  const { labels, properties } = req.body;

  try {
    const record = await session.executeRead((tx) => tx.run("MATCH (n) WHERE elementId(n) = $id RETURN n, labels(n) AS currentLabels", { id: id }));

    const nodeRecord = record.records[0];
    if (!nodeRecord) {
      return res.status(404).send("Node not found");
    }

    const node = nodeRecord.get("n");
    const currentLabels = nodeRecord.get("currentLabels");

    // set updated properties
    let newProps = { ...node.properties, ...(properties || {}) };
    delete newProps.embedding;

    // if no labels are given, keep the previous ones. Else update them to new ones
    let newLabels = currentLabels;
    if (Array.isArray(labels) && labels.length > 0) {
      newLabels = labels.map((l) => l.replace(/[^A-Za-z0-9_]/g, "")).filter(Boolean);
    }
    newLabels.push("Searchable");

    // update query to modify properties, remove and add labels as required
    const query = `
      MATCH (n)
      WHERE elementId(n) = $id
      SET n = $props
      WITH n
      ${currentLabels
        .filter((l) => !newLabels.includes(l))
        .map((l) => `REMOVE n:${l}`)
        .join("\n")}
      ${newLabels
        .filter((l) => !currentLabels.includes(l))
        .map((l) => `SET n:${l}`)
        .join("\n")}
      RETURN n
    `;

    const updatedRecord = await session.executeWrite((tx) => tx.run(query, { id: id, props: newProps }));

    const updatedNode = updatedRecord.records[0].get("n");

    await recomputeNodeEmbedding(id);

    return res.status(200).send(updatedNode);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Node update failed");
  } finally {
    await session.close();
  }
};

const nodeDeletePost = async (req, res) => {
  const { id } = req.params;
  const session = driver.session();

  try {
    const result = await session.executeWrite((tx) =>
      tx.run(
        `
        MATCH (n)
        WHERE elementId(n) = $id
        DETACH DELETE n
        RETURN COUNT(n) AS deletedCount
        `,
        { id }
      )
    );

    // Neo4j returns COUNT(n) = 0 if no node matched
    const deletedCount = result.records[0].get("deletedCount").toNumber?.() ?? 0;

    if (deletedCount === 0) {
      return res.status(404).send("Node not found");
    }

    res.status(200).send(`Node with id ${id} deleted successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting node");
  } finally {
    await session.close();
  }
};

const nodeRelationsGet = async (req, res) => {};

export default {
  nodeGetAll,
  nodeGet,
  nodeSearch,
  nodeCreateGet,
  nodeCreatePost,
  nodeUpdateGet,
  nodeUpdatePost,
  nodeDeletePost,
  nodeRelationsGet,
};
