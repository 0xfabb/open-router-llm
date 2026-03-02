import {
  CreatedUser,
  loggedInUser,
  ServiceResult,
  User,
} from "../types/userTypes";
import { compare, hash } from "bcryptjs";
import { validateSignUpUser } from "../utils/validators";
import { FIFTEEN_MINUTES } from "../lib/constants";
import { prisma } from "../lib/prisma";
import crypto from "crypto";
import type { UserModel } from "../generated/prisma/models/User";

export async function signUpService(
  userStruct: User,
): Promise<ServiceResult<UserModel | undefined>> {
  try {
    const passwordPlain = userStruct.password;
    const accessToken = crypto.randomBytes(32).toString("hex");
    const refreshToken = crypto.randomBytes(36).toString("hex");
    const passwordHashed = await hash(passwordPlain, 15);
    const tokenExpires = new Date(Date.now() + FIFTEEN_MINUTES);

    const existingUser = await prisma.user.findUnique({
      where: { email: userStruct.email },
    });
    if (existingUser) {
      return {
        success: false,
        error: "Email already registered",
        statusCode: 409,
        tokens: {},
      };
    }

    const createdUser = await prisma.user.create({
      data: {
        firstname: userStruct?.firstname ?? null,
        lastname: userStruct?.lastname ?? null,
        userName: userStruct?.userName,
        email: userStruct?.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpires: tokenExpires,
        password: passwordHashed,
        isEmailVerified: false,
      },
    });
    if (!createdUser) {
      const returnData = {
        success: false,
        data: undefined,
        statusCode: 500,
        tokens: {},
      };
      return returnData;
    }
    const returnData = {
      success: true,
      data: createdUser,
      statusCode: 201,
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
    return returnData;
  } catch (error) {
    console.error("SignUp user service panicked with error: ", error);
    const returnData = {
      success: false,
      error: "Internal Server Error",
      statusCode: 500,
      tokens: {},
    };
    return returnData;
  }
}

export async function loginService(
  email: string,
  password: string,
): Promise<ServiceResult<loggedInUser | undefined>> {
  try {
    const gotUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!gotUser) {
      const returnData = {
        success: false,
        msg: "User not found",
        data: undefined,
        tokens: {},
      };
      return returnData;
    }

    const userName = gotUser.userName;
    const passwordStored = gotUser.password;
    const isMatch = await compare(password, passwordStored);

    // If password doesn't match, return error
    if (!isMatch) {
      const returnData = {
        success: false,
        msg: "Wrong password entered",
        data: undefined,
        tokens: {},
      };
      return returnData;
    }

    // Password is correct - generate new tokens and update DB
    const newRefreshToken = crypto.randomBytes(32).toString("hex");
    const newAccessToken = crypto.randomBytes(32).toString("hex");
    const newLastlogin = new Date(Date.now());
    const tokenExpires = new Date(Date.now() + FIFTEEN_MINUTES);

    const updateAfterLogin = await prisma.user.update({
      where: {
        userName: userName,
      },
      data: {
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
        lastLogin: newLastlogin,
        tokenExpires: tokenExpires,
      },
    });
    console.log("Updated user details after login: ", updateAfterLogin);

    const loggedInUser = {
      email: gotUser.email,
      userName: userName,
    };
    const returnData = {
      success: true,
      data: loggedInUser,
      tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
      },
    };
    return returnData;
  } catch (error) {
    console.log("The login service panicked with error: ", error);
    const returnData = {
      success: false,
      data: undefined,
      statusCode: 500,
      tokens: {},
    };
    return returnData;
  }
}
