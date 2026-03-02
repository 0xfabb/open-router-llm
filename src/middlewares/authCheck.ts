import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function loginCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.refreshToken;
    const { userName } = req.body;
    console.log("Middleware got the token as: ", token);
    console.log("Middleware got the userName as: ", userName);

    if (!token || typeof token !== "string") {
      return res.status(400).json({ msg: "Invalid token provided" });
    }

    if (!userName || typeof userName !== "string") {
      return res.status(400).json({ msg: "Invalid userName provided" });
    }

    const user = await prisma.user.findUnique({
      where: { userName: userName },
    });
    if (!user) {
      console.log(
        "Middleware couldn't find the user with this token and username",
      );
      return res.status(401).json({ msg: "User not found" });
    }

    if (!user.refreshToken) {
      console.log("There is no refresh token saved for this user");

      return res.status(401).json({ msg: "No refresh token found for user" });
    }

    if (token !== user.refreshToken) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    if (!user.tokenExpires || user.tokenExpires.getTime() < Date.now()) {
      console.log("Token got expired cutu, please phirse login crow");

      return res.status(401).json({
        msg: "Token expired, please login again",
      });
    }

    next();
  } catch (error) {
    console.error("Auth check middleware error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}
