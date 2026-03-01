import { hash, compare } from "bcryptjs";
import { Request, Response } from "express";

export const getKeyControl = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
  } catch (error) {
    console.log("Got this error: ", error);
  }
};
