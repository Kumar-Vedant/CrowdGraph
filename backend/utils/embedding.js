import driver from "../db/neo4j.js";
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

export async function recomputeNodeEmbedding(nodeId) {
  const session = driver.session();

  try {
    // fetch the node and relationships if they exist
    const query = `
        MATCH (n)
        WHERE elementId(n) = $nodeId
        OPTIONAL MATCH (n)-[r]-(m)
        RETURN n, collect({relType: type(r), neighborLabels: labels(m), neighborProps: m}) AS rels
      `;
    const result = await session.executeRead((tx) => tx.run(query, { nodeId }));
    if (result.records.length === 0) return;

    const record = result.records[0];
    const node = record.get("n");
    const relationships = record.get("rels");

    // prepare properties for vector embedding by converting them to a string of the form (key: value; key: value; ...)
    const propsText = Object.entries(node.properties)
      .filter(([key]) => key !== "embedding")
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");

    // prepare relationships for vector embedding by converting them to a string of the form (relation type label1, label2,... neighbour name; same for all nodes)
    const relsText = (relationships || [])
      .map((r) => {
        const labels = r.neighborLabels?.join(", ") || "";
        const name = r.neighborProps?.name || "";
        return `${r.relType || ""} ${labels} (${name})`;
      })
      .join("; ");

    const text = `
        Labels: ${node.labels.join(", ")};
        Properties: ${propsText};
        Relationships: ${relsText};
      `;

    // compute embedding
    const embedding = await client.featureExtraction({
      model: "google/embeddinggemma-300m",
      inputs: text,
      provider: "hf-inference",
    });

    // set embedding in the DB
    await session.executeWrite((tx) => tx.run(`MATCH (n) WHERE elementId(n) = $nodeId SET n.embedding = $embedding`, { nodeId, embedding }));
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}
