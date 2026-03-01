import {
  CreatedUser,
  loggedInUser,
  ServiceResult,
  User,
} from "../types/userTypes";
import { compare, hash } from "bcryptjs";
import { validateSignUpUser } from "../utils/validators";
import { FIVE_MINUTES } from "../lib/constants";
import { prisma } from "../lib/prisma";

export async function signUpService(
  userStruct: User,
): Promise<ServiceResult<CreatedUser | undefined>> {
  try {
    const passwordPlain = userStruct.password;
    const passwordHashed = await hash(passwordPlain, 15);
    const accessToken = await hash(userStruct?.email + Date.now(), 12);
    const refreshToken = await hash(userStruct?.userName + Date.now(), 12);
    const tokenExpires = new Date(Date.now() + FIVE_MINUTES);

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
      };
      return returnData;
    }
    const returnData = {
      success: true,
      data: createdUser,
      statusCode: 200,
    };
    return returnData;
  } catch (error) {
    console.error("SignUp user service panicked with error: ", error);
    const returnData = {
      success: false,
      error: "error",
      statusCode: 200,
    };
    return returnData;
  }
}

export async function loginService(
  email: string,
  password: string,
): Promise<ServiceResult<loggedInUser | undefined>> {
  try {
    const passwordHash = await hash(password, 15);
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
      };
      return returnData;
    }

    // Password is correct - generate new tokens and update DB
    const newRefreshToken = await hash(userName + Date.now(), 12);
    const newAccessToken = await hash(gotUser.email + Date.now(), 12);
    const newLastlogin = new Date(Date.now());
    const tokenExpires = new Date(Date.now() + FIVE_MINUTES);

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
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenExpires: tokenExpires,
    };
    const returnData = {
      success: true,
      data: loggedInUser,
    };
    return returnData;
  } catch (error) {
    console.log("The login service panicked with error: ", error);
    const returnData = {
      success: false,
      data: undefined,
      statusCode: 500,
    };
    return returnData;
  }
}
