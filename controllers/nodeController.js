import driver from "../db/neo4j.js";

const nodeGetAll = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run("MATCH (p:PLAYER) RETURN p");
    const users = result.records.map((record) => record.get("p").properties["name"]);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  } finally {
    await session.close();
  }
};

const nodeGet = async (req, res) => {};

const nodeSearch = async (req, res) => {};

const nodeCreateGet = async (req, res) => {};

const nodeCreatePost = async (req, res) => {};

const nodeUpdateGet = async (req, res) => {};

const nodeUpdatePost = async (req, res) => {};

const nodeDeletePost = async (req, res) => {};

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
