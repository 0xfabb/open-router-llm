import { Request, Response } from "express";

export const getLLMControl = async (req: Request, res: Response) => {
  return res.json({
    msg: "Get LLMs controller is working",
  });
};
