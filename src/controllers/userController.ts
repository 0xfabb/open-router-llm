import { Request, Response } from "express";
import {
  createApiKeyService,
  getApiKeysService,
} from "../services/UserService";
import { APIResponse } from "../types/globalTypes";
import { apiKey } from "../types/userTypes";
import { nullable } from "zod";

export const getKeyControl = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    console.log("Fetching API keys for username:", username);

    const apikeys = await getApiKeysService(username);
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
    const { username, project } = req.body;
    console.log("Recieved data for key creation as - ", username, project);

    if (!username || !project) {
      const returnData: APIResponse = {
        msg: "Please send all the required fields",
        data: null,
        success: false,
        status: 400,
      };
      console.log("Didn't get all the required params for key-gen");
      return res.json(returnData);
    }
    const createdKey = await createApiKeyService(username, project);
    console.log("The key was created with data - ", createdKey.data);
    
    if (!createdKey) {
      const returnData: APIResponse = {
        msg: "Api key gen error in service",
        data: null,
        success: false,
        status: 400,
      };
      return res.json(returnData);
    }
    const returnData: APIResponse = {
      msg: `A new api key under the project - ${project} is created successfully`,
      data: createdKey?.data || null,
      success: true,
      status: 201,
    };
    return res.json(returnData);
  } catch (error) {
    console.log("Got this error at createKey - ", error);
  }
};
