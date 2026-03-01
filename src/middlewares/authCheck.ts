import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function loginCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.refreshtoken;
    const { userName } = req.body;
    console.log("Got the token as: ", token);
    console.log("Got the userName as: ", userName);

    if (!token || typeof token !== "string") {
      return res.status(400).json({ msg: "Invalid token provided" });
    }

    if (!userName || typeof userName !== "string") {
      return res.status(400).json({ msg: "Invalid userName provided" });
    }

    const user = await prisma.user.findUnique({
      where: { userName: userName },
    });
    console.log("Got the user as - ", user);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Check if user has a refresh token
    if (!user.refreshToken) {
      return res.status(401).json({ msg: "No refresh token found for user" });
    }

    // Verify the provided token matches the stored refresh token
    if (token !== user.refreshToken) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    // Check if token has expired
    if (!user.tokenExpires || user.tokenExpires.getTime() < Date.now()) {
      return res.status(401).json({
        msg: "Token expired, please login again",
      });
    }

    // Token is valid, proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth check middleware error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}
