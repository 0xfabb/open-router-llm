import { Request, Response } from "express";
export const getLLMControl = async (req: Request, res: Response) => {
    return res.json({
        msg: "get LLMs route is working"
    })
};
