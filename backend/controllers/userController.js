import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

const userListGet = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users");
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
      },
    });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Search failed");
  }
};

const userCreate = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing required fields: 'username' and 'password' are needed");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        passwordHash: hashedPassword,
      },
    });
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create user");
  }
};

const userUpdate = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  // if no editable fields are provided to update
  if (!username && !password) {
    return res.status(400).send("No valid fields provided for update. Only 'username' and 'password' are editable");
  }

  const updateData = {};
  if (username) {
    updateData.username = username;
  }

  try {
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update user");
  }
};

const userDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.redirect("/user");
  } catch (error) {
    console.error(error);
    res.status(500).send("Delete failed");
  }
};

export default {
  userListGet,
  userSearch,
  userCreate,
  userUpdate,
  userDelete,
};
