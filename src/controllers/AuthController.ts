import { Request, Response } from "express";
import { createUserName } from "../utils/utilfunctions";
import { APIResponse } from "../types/globalTypes";
import { loginService, signUpService } from "../services/AuthService";
import { User } from "../types/userTypes";

export const signupControl = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    console.log("Got the body as: ", req.body);

    if (!email) {
      const response: APIResponse = {
        msg: "Provided email does not exist cannot create username",
        data: {},
        success: false,
        status: 400,
      };
      res.json(response);
    }
    const userName = await createUserName(email);
    console.log("Created username: ", userName);

    const userStruct: User = {
      userName,
      firstname,
      lastname,
      email,
      password,
    };
    console.log("User Struct is: ", userStruct);

    const createdUser = await signUpService(userStruct);
    if (createdUser) {
      const success: APIResponse = {
        msg: "User signed up succcess",
        data: createdUser?.data || null,
        success: true,
        status: 201,
      };
      console.log("Signed Up user as: ", createdUser);
      return res.json(success);
    }
  } catch (error) {
    console.log("Got an error: ", error);
    const failed: APIResponse = {
      msg: "User cannot be signed up",
      data: {},
      success: false,
      status: 500,
    };
    console.log("Signed Up user failed with error as: ", error);
    return res.json(failed);
  }
};

export const loginControl = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
    }
    const loginUser = await loginService(email, password);
    const returnData: APIResponse = {
      msg: "Logged in success",
      data: loginUser?.data || null,
      success: true,
      status: 200,
    };
    return res.json(returnData);
  } catch (error) {
    const returnData: APIResponse = {
      msg: "Internal Server Error",
      data: {},
      success: false,
      status: 500,
    };
    return res.json(returnData);
  }
};

export const changePSControl = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
