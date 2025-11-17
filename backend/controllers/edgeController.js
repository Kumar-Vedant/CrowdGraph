import { TargetType } from "@prisma/client";
import driver from "../db/neo4j.js";
import { recomputeNodeEmbedding } from "../utils/embedding.js";
import { checkProposal } from "../utils/checkProposal.js";

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

const edgeProposalCommunityGet = async (req, res) => {
  const { communityId } = req.params;

  try {
    const edgeProposalRecords = await prisma.edgeProposal.findMany({
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
        relationType: true,
        properties: true,
        status: true,
        createdAt: true,
        upvotes: true,
        downvotes: true,
      },
    });

    const edgeProposals = edgeProposalRecords.map(({ user, relationType, ...rest }) => ({ ...rest, type: relationType, username: user.username }));
    res.status(200).json({
      success: true,
      count: edgeProposals.length,
      data: edgeProposals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
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

const edgeProposalCreate = async (req, res) => {
  const { userId, type, communityId, properties, sourceId, targetId } = req.body;

  try {
    const edgeProposalRecord = await prisma.edgeProposal.create({
      data: {
        userId: userId,
        communityId: communityId,
        relationType: type,
        properties: properties,
        sourceId: sourceId,
        targetId: targetId,
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
        relationType: true,
        properties: true,
        sourceId: true,
        targetId: true,
        status: true,
        createdAt: true,
        upvotes: true,
        downvotes: true,
      },
    });

    const { user, relationType, ...rest } = edgeProposalRecord;
    const edgeProposal = { ...rest, type: relationType, username: user.username };

    res.status(200).json({
      success: true,
      data: edgeProposal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const edgeProposalVote = async (req, res) => {
  const { proposalId, voteValue, userId } = req.body;

  // get the proposal's communityId and the credits the user has in that community
  const result = await prisma.edgeProposal.findUnique({
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
          targetType: TargetType.EDGE_PROPOSAL,
          userId: userId,
          voteValue: voteValue,
        },
      });
    }

    const field = voteValue === 1 ? "upvotes" : "downvotes";
    const updatedProposal = await prisma.edgeProposal.update({
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
      const edgeId = await addEdge(
        updatedProposal.relationType,
        updatedProposal.communityId,
        updatedProposal.sourceId,
        updatedProposal.targetId,
        updatedProposal.properties
      );

      await prisma.edgeProposal.update({
        where: {
          id: proposalId,
        },
        data: {
          kgEdgeId: edgeId,
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
      await prisma.edgeProposal.update({
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

    // find the edgeProposal record and send it back
    const edgeProposalRecord = await prisma.edgeProposal.findUnique({
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
        relationType: true,
        properties: true,
        status: true,
        createdAt: true,
        upvotes: true,
        downvotes: true,
      },
    });

    const { user, relationType, ...rest } = edgeProposalRecord;
    const edgeProposal = { ...rest, type: relationType, username: user.username };

    res.status(200).json({
      success: true,
      data: edgeProposal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
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

async function addEdge(type, communityId, sourceId, targetId, properties) {
  const session = driver.session();

  // sanitize relationship type
  const relType = type.replace(/[^A-Za-z0-9_]/g, "");
  if (!relType) return res.status(400).send("Invalid relationship type");

  properties.communityId = communityId;
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

    return rel.identity.toString();
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}

export default {
  edgeGet,
  edgeProposalCommunityGet,
  edgeCreate,
  edgeProposalCreate,
  edgeProposalVote,
  edgeUpdate,
  edgeDelete,
};
