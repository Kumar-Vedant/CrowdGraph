import neo4j from "neo4j-driver";

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));

// async function verifyConnection() {
//   try {
//     const session = driver.session();
//     await session.run("RETURN 1");
//     console.log("Neo4j Aura se connect ho gaya");
//     await session.close();
//   } catch (err) {
//     console.error("Neo4j connection mein gadbad:", err);
//   }
// }
// verifyConnection();

export default driver;
