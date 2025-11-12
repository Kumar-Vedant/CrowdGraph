import pkg from "@prisma/client";
import { json } from "express";
const { PrismaClient, Role } = pkg;

const prisma = new PrismaClient();

const communityListGet = async (req, res) => {
  try {
    const communities = await prisma.community.findMany();
    res.status(200).json({
      success: true,
      count: communities.length,
      communities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityRandomGet = async (req, res) => {
  try {
    const communities = await prisma.$queryRaw`
      SELECT * FROM "Community"
      ORDER BY RANDOM()
      LIMIT 10;
    `;

    res.status(200).json({
      success: true,
      count: communities.length,
      communities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communitySearch = async (req, res) => {
  const { title } = req.query;
  try {
    const communities = await prisma.community.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });
    res.status(200).json({
      success: true,
      count: communities.length,
      communities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityGet = async (req, res) => {
  const { id } = req.params;

  try {
    const community = await prisma.community.findUnique({
      where: {
        id: id,
      },
    });

    if (!community) {
      return res.status(404).json({
        success: false,
        error: "Community not found",
      });
    }

    res.status(200).json({
      success: true,
      count: community.count,
      community,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityUsersGet = async (req, res) => {
  const { id } = req.params;
  try {
    const communityExists = await prisma.community.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!communityExists) {
      return res.status(404).json({
        success: false,
        error: "Community not found.",
      });
    }

    const userCommunityLinks = await prisma.userCommunity.findMany({
      where: {
        communityId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
      },
    });
    const users = userCommunityLinks.map((link) => link.user);
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityJoinUser = async (req, res) => {
  const { id, userId } = req.params;

  const existing = await prisma.userCommunity.findUnique({
    where: {
      userId_communityId: { userId, communityId: id },
    },
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      error: "User is already a member of this community",
    });
  }

  try {
    // transaction to ensure both creations happen together
    await prisma.$transaction([
      prisma.userCommunity.create({
        data: {
          userId: userId,
          communityId: id,
          role: Role.MEMBER,
        },
      }),
      prisma.userCommunityReputation.create({
        data: {
          userId: userId,
          communityId: id,
        },
      }),
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityLeaveUser = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const community = await prisma.community.findUnique({
      where: {
        id: id,
      },
      select: {
        ownerId: true,
      },
    });
    // if user is community owner
    if (community.ownerId === userId) {
      return res.status(400).json({
        success: false,
        error: "Community owners cannot leave their own community",
      });
    }

    // transaction to ensure both deletes happen together
    await prisma.$transaction([
      prisma.userCommunity.delete({
        where: {
          userId_communityId: { userId, communityId: id },
        },
      }),
      prisma.userCommunityReputation.delete({
        where: {
          userId_communityId: { userId, communityId: id },
        },
      }),
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityGraphGet = async (req, res) => {};

const communityForumGet = async (req, res) => {};

const communityCreate = async (req, res) => {
  const { title, ownerId, description } = req.body;

  if (!title || !ownerId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'title' and 'ownerId' are needed",
    });
  }

  try {
    const newCommunity = await prisma.community.create({
      data: {
        title: title,
        ownerId: ownerId,
        description: description,
      },
    });

    // create entries in userCommunity and userCommunityReputation for the owner
    await prisma.userCommunity.create({
      data: {
        userId: ownerId,
        communityId: (await newCommunity).id,
        role: Role.OWNER,
      },
    });
    await prisma.userCommunityReputation.create({
      data: {
        userId: ownerId,
        communityId: (await newCommunity).id,
      },
    });

    res.status(200).json({
      success: true,
      community: newCommunity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const updateData = {};

  // if no editable fields are provided to update
  if (!title && !description) {
    return res.status(400).json({
      success: false,
      error: "No valid fields provided for update. Only 'title' and 'description' are editable",
    });
  }

  if (title) {
    updateData.title = title;
  }
  if (description) {
    updateData.description = description;
  }

  try {
    const communityExists = await prisma.community.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!communityExists) {
      return res.status(404).json({
        success: false,
        error: "Community not found",
      });
    }

    const updatedCommunity = await prisma.community.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    res.status(200).json({
      success: true,
      community: updatedCommunity,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const communityDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const communityExists = await prisma.community.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!communityExists) {
      return res.status(404).json({
        success: false,
        error: "Community not found",
      });
    }

    await prisma.community.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

export default {
  communityListGet,
  communityRandomGet,
  communitySearch,
  communityGet,
  communityJoinUser,
  communityLeaveUser,
  communityUsersGet,
  communityGraphGet,
  communityForumGet,
  communityCreate,
  communityUpdate,
  communityDelete,
};
