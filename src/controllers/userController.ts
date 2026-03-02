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
    const { userName } = req.body;
    console.log("Fetching API keys for userName:", userName);

    const apikeys = await getApiKeysService(userName);
    console.log("Service returned:", apikeys);

    if (!apikeys || !apikeys.success) {
      const response: APIResponse = {
        data: {},
        msg: apikeys?.error || "Couldn't find any keys for user, please create one first",
        success: false,
        status: 404,
      };
      return res.status(404).json(response);
    }
    
    if (!apikeys.data || apikeys.data.length === 0) {
      const response: APIResponse = {
        data: [],
        msg: "No API keys found for this user",
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
    return res.status(500).json(response);
  }
};

export const createKeyControl = async (req: Request, res: Response) => {
  try {
    const { userName, project } = req.body;
    console.log("Recieved data for key creation as - ", userName, project);

    if (!userName || !project) {
      const returnData: APIResponse = {
        msg: "Please send all the required fields",
        data: null,
        success: false,
        status: 400,
      };
      console.log("Didn't get all the required params for key-gen");
      return res.status(400).json(returnData);
    }
    const createdKey = await createApiKeyService(userName, project);
    console.log("The key was created with data - ", createdKey.data);

    if (!createdKey || !createdKey.success) {
      const returnData: APIResponse = {
        msg: createdKey?.error || "Api key gen error in service",
        data: null,
        success: false,
        status: 400,
      };
      return res.status(400).status(400).json(returnData);
    }
    const returnData: APIResponse = {
      msg: `A new api key under the project - ${project} is created successfully`,
      data: createdKey?.data || null,
      success: true,
      status: 201,
    };
    return res.status(201).json(returnData);
  } catch (error) {
    console.log("Got this error at createKey - ", error);
    return res.status(500).json({ msg: "Internal error" });
  }
};
