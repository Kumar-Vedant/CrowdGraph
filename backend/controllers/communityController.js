import { Role, PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

const communityListGet = async (req, res) => {
  try {
    const communities = await prisma.community.findMany();
    res.status(200).send(communities);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching communities");
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
    res.status(200).send(communities);
  } catch (error) {
    console.log(error);
    res.status(500).send("Search failed");
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
    res.status(200).send(community);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching community");
  }
};

const communityJoinUser = async (req, res) => {
  const { id, userId } = req.params;

  try {
    await prisma.userCommunity.create({
      data: {
        userId: userId,
        communityId: id,
        role: Role.MEMBER,
      },
    });
    await prisma.userCommunityReputation.create({
      data: {
        userId: userId,
        communityId: id,
      },
    });

    res.status(200).send("Community joined sucessfully.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error joining community");
  }
};

const communityUsersGet = async (req, res) => {
  const { id } = req.params;
  try {
    const userCommunityLinks = await prisma.userCommunity.findMany({
      where: {
        communityId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    const users = userCommunityLinks.map((link) => link.user);
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users in the community");
  }
};

const communityGraphGet = async (req, res) => {};

const communityForumGet = async (req, res) => {};

const communityCreate = async (req, res) => {
  const { title, ownerId, description } = req.body;

  if (!title || !ownerId) {
    return res.status(400).send("Missing required fields: 'title' and 'ownerId' are needed");
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

    res.status(200).send(newCommunity);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create community");
  }
};

const communityUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const updateData = {};

  // if no editable fields are provided to update
  if (!title && !description) {
    return res.status(400).send("No valid fields provided for update. Only 'title' and 'description' are editable");
  }

  if (title) {
    updateData.title = title;
  }
  if (description) {
    updateData.description = description;
  }

  try {
    const updatedCommunity = await prisma.community.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    res.status(200).send(updatedCommunity);
  } catch (error) {
    console.error(err);
    res.status(500).send("Failed to update community");
  }
};

const communityDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.community.delete({
      where: {
        id: id,
      },
    });
    res.redirect("/community");
  } catch (error) {
    console.error(error);
    res.status(500).send("Delete failed");
  }
};

export default {
  communityListGet,
  communitySearch,
  communityGet,
  communityJoinUser,
  communityUsersGet,
  communityGraphGet,
  communityForumGet,
  communityCreate,
  communityUpdate,
  communityDelete,
};
