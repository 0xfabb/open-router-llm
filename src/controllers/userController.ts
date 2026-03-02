import { Request, Response } from "express";
import {
  createApiKeyService,
  getApiKeysService,
} from "../services/UserService";
import { APIResponse } from "../types/globalTypes";

export const getKeyControl = async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    console.log("Fetching API keys for userName:", userName);

    const apikeys = await getApiKeysService(userName);
    console.log("Service returned:", apikeys);

    if (!apikeys || !apikeys.success || !apikeys.data) {
      const response: APIResponse = {
        data: {},
        msg: "Couldn't find any keys for user, please create one first",
        success: true,
        status: 200,
      };
      return res.json(response);
    }
    const response: APIResponse = {
      data: apikeys.data,
      msg: "Found the api keys",
      success: true,
      status: 200,
    };
    return res.json(response);
  } catch (error) {
    console.log("Got this error: ", error);
    const response: APIResponse = {
      data: {},
      msg: "Internal Server Error",
      success: false,
      status: 500,
    };
    return res.json(response);
  }
};

export const createKeyControl = async (req: Request, res: Response) => {
  try {
    const { userName, project } = req.body;
    if (!userName || !project) {
      const returnData: APIResponse = {
        msg: "Please send all the required fields",
        data: null,
        success: false,
        status: 400,
      };
      console.log("Didn't get all the required params for key-gen");
      return res.json(returnData);
    }
    const createdKey = await createApiKeyService(userName, project);
  } catch (error) {
    console.log("Got this error at createKey - ", error);
  }
};
