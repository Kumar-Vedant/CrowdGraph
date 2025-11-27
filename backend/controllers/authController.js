import bcrypt from "bcryptjs";

import pkg from "@prisma/client";
import { error } from "neo4j-driver";
const { PrismaClient, Role } = pkg;

const prisma = new PrismaClient();

const register = async (req, res) => {};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'username' and 'password' are needed",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const match = await bcrypt.compare(password, user.passwordHash);

    if (match) {
      const { passwordHash, updatedAt, ...rest } = user;

      const userData = { ...rest };
      res.status(200).json({
        success: true,
        data: userData,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Incorrect username or password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

export default {
  register,
  login,
};
