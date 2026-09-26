import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const register = async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    if (!username || !fullname || !password) {
      return res.status(400).json({
        message: "username, fullname and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const userRole = await prisma.role.findUnique({
      where: {
        rolename: "USER",
      },
    });

    const standardMembership = await prisma.membership.findUnique({
      where: {
        mname: "STANDARD",
      },
    });

    if (!userRole || !standardMembership) {
      return res.status(500).json({
        message: "Default role or membership not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        fullname,
        password: hashedPassword,
        roleid: userRole.roleid,
        mid: standardMembership.mid,
      },
      select: {
        uid: true,
        username: true,
        fullname: true,
        role: {
          select: {
            rolename: true,
          },
        },
        membership: {
          select: {
            mname: true,
            score: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
        membership: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        uid: user.uid,
        username: user.username,
        role: user.role.rolename,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        uid: user.uid,
        username: user.username,
        fullname: user.fullname,
        role: user.role.rolename,
        membership: {
          name: user.membership.mname,
          score: user.membership.score,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uid: req.user.uid,
      },
      select: {
        uid: true,
        username: true,
        fullname: true,
        role: {
          select: {
            rolename: true,
          },
        },
        membership: {
          select: {
            mname: true,
            score: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};