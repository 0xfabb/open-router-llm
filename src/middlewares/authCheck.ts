import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function loginCheck(req: Request, res: Response) {
  try {
    const token = req.headers.refreshtoken;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ msg: "Invalid token" });
    }

    const user = await prisma.user.findFirst({
      where: { refreshToken: token },
    });

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    if (!user.tokenExpires || user.tokenExpires.getTime() <= Date.now()) {
      return res.status(401).json({
        msg: "Token expired, please login again",
      });
    }

    return res.json({ msg: "Token valid" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
}
