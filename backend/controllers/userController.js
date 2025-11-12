import bcrypt from "bcryptjs";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const userGet = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const userListGet = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
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

const userSearch = async (req, res) => {
  const { username } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
        select: {
          id: true,
          username: true,
          createdAt: true,
        },
      },
    });
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

const userCommunitiesGet = async (req, res) => {
  const { id } = req.params;
  try {
    const userExists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const userCommunities = await prisma.userCommunity.findMany({
      where: {
        userId: id,
      },
      include: {
        community: true,
      },
    });

    const communities = userCommunities.map(({ community, role }) => ({
      ...community,
      role,
    }));

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

const userCreate = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'username' and 'password' are needed",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const userUpdate = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  // if no editable fields are provided to update
  if (!username && !password) {
    return res.status(400).json({
      success: false,
      error: "No valid fields provided for update. Only 'username' and 'password' are editable",
    });
  }

  const updateData = {};
  if (username) {
    updateData.username = username;
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error,
    });
  }
};

const userDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await prisma.user.delete({
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
  userGet,
  userCommunitiesGet,
  userListGet,
  userSearch,
  userCreate,
  userUpdate,
  userDelete,
};
