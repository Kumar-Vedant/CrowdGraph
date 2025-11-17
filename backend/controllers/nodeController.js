import driver from "../db/neo4j.js";
import { recomputeNodeEmbedding } from "../utils/embedding.js";
import { checkProposal } from "../utils/checkProposal.js";
import pkg, { TargetType, ProposalStatus } from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

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

    res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
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
    res.status(500).json({
      success: false,
      error,
    });
  } finally {
    await session.close();
  }
};

const nodeSearch = async (req, res) => {
  const { communityId } = req.params;
  const { name } = req.query;
  const session = driver.session();

  try {
    const result = await session.executeRead((tx) =>
      tx.run(`MATCH (n) WHERE toLower(n.name) CONTAINS toLower($name) AND n.communityId = $communityId RETURN n`, { name, communityId })
    );

    if (result.records.length === 0) {
      return res.status(404).send("Node not found");
    }
    const nodes = result.records.map((record) => {
      const node = record.get("n");
      const { name, embedding, ...rest } = node.properties;
      return {
        id: node.elementId,
        name: name,
        labels: node.labels,
        properties: rest,
      };
    });

    res.status(200).send(nodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  } finally {
    await session.close();
  }
};

const nodeProposalCommunityGet = async (req, res) => {
  const { communityId } = req.params;

  try {
    const nodeProposalRecords = await prisma.nodeProposal.findMany({
      where: {
        communityId: communityId,
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            username: true,
          },
        },
        communityId: true,
        name: true,
        labels: true,
        properties: true,
        status: true,
        createdAt: true,
        upvotes: true,
        downvotes: true,
      },
    });

    const nodeProposals = nodeProposalRecords.map(({ user, ...rest }) => ({ ...rest, username: user.username }));
    res.status(200).json({
      success: true,
      count: nodeProposals.length,
      data: nodeProposals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const nodeCreate = async (req, res) => {
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
    res.status(500).json({
      success: false,
      error,
    });
  } finally {
    await session.close();
  }
};

const nodeProposalCreate = async (req, res) => {
  const { userId, name, communityId, labels, properties } = req.body;

  if (!Array.isArray(labels) || labels.length === 0) {
    return res.status(400).json({
      success: false,
      error: "At least one label required",
    });
  }

  // sanitize labels (to prevent Cypher/SQL injection)
  const sanitizedLabels = labels.map((l) => l.replace(/[^A-Za-z0-9_]/g, "")).filter(Boolean);
  if (sanitizedLabels.length === 0) {
    return res.status(400).send("At least one valid label required");
  }

  try {
    const nodeProposalRecord = await prisma.nodeProposal.create({
      data: {
        userId: userId,
        communityId: communityId,
        name: name,
        labels: labels,
        properties: properties,
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            username: true,
          },
        },
        communityId: true,
        name: true,
        labels: true,
        properties: true,
        status: true,
        createdAt: true,
        upvotes: true,
        downvotes: true,
      },
    });

    const { user, ...rest } = nodeProposalRecord;
    const nodeProposal = { ...rest, username: user.username };

    res.status(200).json({
      success: true,
      data: nodeProposal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const nodeProposalVote = async (req, res) => {
  const { proposalId, voteValue, userId } = req.body;

  // get the proposal's communityId and the credits the user has in that community
  const result = await prisma.nodeProposal.findUnique({
    where: { id: proposalId },
    select: {
      communityId: true,
      community: {
        select: {
          members: {
            where: {
              userId: userId,
            },
            select: {
              credits: true,
            },
            take: 1,
          },
          totalVotingPotential: true,
        },
      },
      userId: true,
    },
  });

  const communityId = result.communityId;
  const credits = result.community.members[0].credits;

  try {
    // check if vote already exists
    const vote = await prisma.vote.findUnique({
      where: {
        targetId_userId: { targetId: proposalId, userId },
      },
      select: {
        id: true,
        voteValue: true,
      },
    });

    const voteCost = 1;
    // if yes, update vote and update upvote/downvote count on proposal
    if (vote) {
      // check if user has enough credits to vote (2n + 1) if current vote is n (Quadratic voting)
      voteCost = 2 * vote.voteValue + 1;
      if (credits < voteCost) {
        return res.status(409).json({
          success: false,
          error: "Insufficient voting credits",
        });
      }

      await prisma.vote.update({
        where: {
          id: vote.id,
        },
        data: {
          voteValue: { increment: voteValue },
        },
      });
    }
    // if no, create a new vote and update upvote/downvote count on proposal
    else {
      // check if user has enough credits to vote
      if (credits < voteCost) {
        return res.status(409).json({
          success: false,
          error: "Insufficient voting credits",
        });
      }

      await prisma.vote.create({
        data: {
          targetId: proposalId,
          targetType: TargetType.NODE_PROPOSAL,
          userId: userId,
          voteValue: voteValue,
        },
      });
    }

    const field = voteValue === 1 ? "upvotes" : "downvotes";
    const updatedProposal = await prisma.nodeProposal.update({
      where: { id: proposalId },
      data: {
        [field]: { increment: 1 },
      },
    });

    // change user reputation and credits
    await prisma.userCommunity.update({
      where: {
        userId_communityId: {
          userId: userId,
          communityId: communityId,
        },
      },
      data: {
        reputation: { increment: 2 },
        credits: { decrement: voteCost },
      },
    });

    // check if this node is to be accepted/rejected
    const status = checkProposal(updatedProposal.upvotes, updatedProposal.downvotes, result.community.totalVotingPotential);
    console.log("Status: " + status);

    // if accepted
    if (status === "ACCEPT") {
      // add the node in the Knowledge Graph
      const nodeId = await addNode(updatedProposal.name, updatedProposal.communityId, updatedProposal.labels, updatedProposal.properties);

      await prisma.nodeProposal.update({
        where: {
          id: proposalId,
        },
        data: {
          kgNodeId: nodeId,
          status: ProposalStatus.APPROVED,
        },
      });

      // increase reputation of the user whose proposal is accepted
      await prisma.userCommunity.update({
        where: {
          userId_communityId: {
            userId: result.userId,
            communityId: communityId,
          },
        },
        data: {
          reputation: { increment: 10 },
        },
      });
    }
    // if rejected
    else if (status === "REJECT") {
      await prisma.nodeProposal.update({
        where: {
          id: proposalId,
        },
        data: {
          status: ProposalStatus.REJECTED,
        },
      });

      await prisma.userCommunity.update({
        where: {
          userId_communityId: {
            userId: result.userId,
            communityId: communityId,
          },
        },
        data: {
          reputation: { decrement: 5 },
        },
      });
    }

    // find the nodeProposal record and send it back
    const nodeProposalRecord = await prisma.nodeProposal.findUnique({
      where: {
        id: proposalId,
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            username: true,
          },
        },
        communityId: true,
        name: true,
        labels: true,
        properties: true,
        status: true,
        createdAt: true,
        upvotes: true,
        downvotes: true,
      },
    });

    const { user, ...rest } = nodeProposalRecord;
    const nodeProposal = { ...rest, username: user.username };

    res.status(200).json({
      success: true,
      data: nodeProposal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const nodeUpdate = async (req, res) => {
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
    res.status(500).json({
      success: false,
      error,
    });
  } finally {
    await session.close();
  }
};

const nodeDelete = async (req, res) => {
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
    res.status(500).json({
      success: false,
      error,
    });
  } finally {
    await session.close();
  }
};

const nodeRelationsGet = async (req, res) => {};

async function addNode(name, communityId, labels, properties) {
  const session = driver.session();

  if (!Array.isArray(labels) || labels.length === 0) {
    return res.status(400).send("At least one label required");
  }

  // sanitize labels (to prevent Cypher injection)
  const sanitizedLabels = labels.map((l) => l.replace(/[^A-Za-z0-9_]/g, "")).filter(Boolean);
  if (sanitizedLabels.length === 0) {
    return res.status(400).send("At least one valid label required");
  }
  const labelString = sanitizedLabels.map((l) => `:${l}`).join("") + ":Searchable";

  properties.name = name;
  properties.communityId = communityId;

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

    // compute embedding
    await recomputeNodeEmbedding(nodeId);

    return nodeId;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}

export default {
  nodeGetAll,
  nodeGet,
  nodeSearch,
  nodeProposalCommunityGet,
  nodeCreate,
  nodeProposalCreate,
  nodeProposalVote,
  nodeUpdate,
  nodeDelete,
  nodeRelationsGet,
};
