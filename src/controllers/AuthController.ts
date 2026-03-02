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
      return res.status(400).json(response);
    }
    const userName = (await createUserName()) || "";
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
    
    // Handle duplicate email error
    if (!createdUser.success && createdUser.statusCode === 409) {
      return res.status(409).json({
        msg: createdUser.error || "Email already registered",
        error: createdUser.error || "Email already registered",
        success: false,
        status: 409,
        data: {},
      });
    }
    
    if (createdUser.success && createdUser.data) {
      // Remove sensitive fields from response
      const { password, accessToken, refreshToken, tokenExpires, ...safeUserData } = createdUser.data;
      
      const success: APIResponse = {
        msg: "User signed up successfully",
        data: safeUserData,
        success: true,
        status: 201,
      };
      const refreshTokenCookie = createdUser.tokens.refreshToken;
      const accessTokenCookie = createdUser.tokens.accessToken;
      console.log("Signed Up user as: ", createdUser);
      return res
        .cookie("refreshToken", refreshTokenCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .cookie("accessToken", accessTokenCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(201)
        .json(success);
    }
    
    // Handle other signup errors
    return res.status(500).json({
      msg: "Signup failed",
      success: false,
      status: 500,
      data: {},
    });
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
      const failedInputs: APIResponse = {
        msg: "The inputs were not provided please send inputs",
        data: {},
        success: false,
        status: 400,
      };
      return res.status(400).json(failedInputs);
    }
    const loginUser = await loginService(email, password);
    if (loginUser.success != true) {
      const failedLogin: APIResponse = {
        msg: `Login failed due to error - ${loginUser.error}`,
        data: loginUser,
        status: 400,
        success: false,
      };
      return res.status(400).json(failedLogin);
    }
    const success: APIResponse = {
      msg: "Logged in success",
      data: loginUser?.data || null,
      success: true,
      status: 200,
    };
    const refreshToken = loginUser.tokens.refreshToken;
    const accessToken = loginUser.tokens.accessToken;
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(201)
      .json(success);
  } catch (error) {
    const returnData: APIResponse = {
      msg: "Internal Server Error",
      data: {},
      success: false,
      status: 500,
    };
    return res.status(500).json(returnData);
  }
};

export const changePSControl = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
