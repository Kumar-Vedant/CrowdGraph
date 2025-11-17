import express from "express";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const creditRouter = express.Router();
const prisma = new PrismaClient();

creditRouter.post("/", async (req, res) => {
  try {
    // verify authorization header from Github Actions
    // const auth = req.headers.authorization;
    // if (!auth || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return res.status(403).json({ error: "Forbidden" });
    // }

    // load all userCommunity entries
    const userCommunities = await prisma.userCommunity.findMany({
      select: {
        userId: true,
        communityId: true,
        reputation: true,
      },
    });

    // prepare updates with credits and maxVotes for each user in each community
    const updates = [];
    for (const uc of userCommunities) {
      // #credits = sqrt(rep)
      const credits = Math.floor(Math.sqrt(uc.reputation));
      // #maxVotes = sqrt(credits) because of Quadratic voting scheme
      const maxVotes = Math.floor(Math.sqrt(credits));

      updates.push({
        userId: uc.userId,
        communityId: uc.communityId,
        credits,
        maxVotes,
      });
    }

    // update credits for all users in each community
    await Promise.all(
      updates.map((u) =>
        prisma.userCommunity.update({
          where: {
            userId_communityId: {
              userId: u.userId,
              communityId: u.communityId,
            },
          },
          data: {
            credits: u.credits,
          },
        })
      )
    );

    // calculate totalVotingPotential for each community
    const totals = {};
    for (const u of updates) {
      if (!totals[u.communityId]) {
        totals[u.communityId] = 0;
      }
      totals[u.communityId] += u.maxVotes;
    }

    // update totalVotingPotential for each community
    for (const communityId in totals) {
      await prisma.community.update({
        where: {
          id: communityId,
        },
        data: {
          totalVotingPotential: totals[communityId],
        },
      });
    }

    return res.status(200).json({
      success: true,
      updatedUsers: updates.length,
      updatedCommunities: totals.size,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

export default creditRouter;
