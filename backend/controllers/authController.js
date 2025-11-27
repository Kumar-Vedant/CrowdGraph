import bcrypt from "bcryptjs";

import pkg from "@prisma/client";
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
      select: {
        passwordHash: true,
      },
    });

    const match = await bcrypt.compare(password, user.passwordHash);

    let success = false;
    if (match) {
      success = true;
    }
    res.status(200).json({
      success: success,
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
  register,
  login,
};
