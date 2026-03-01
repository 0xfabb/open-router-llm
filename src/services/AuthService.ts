import { CreatedUser, ServiceResult, User } from "../types/userTypes";
import { hash } from "bcryptjs";
import { validateSignUpUser } from "../utils/validators";
import { FIVE_MINUTES } from "../lib/constants";
import { prisma } from "../lib/prisma";

export async function signUpService(
  userStruct: User,
): Promise<ServiceResult<CreatedUser | undefined>> {
  try {
    const passwordPlain = userStruct.password;
    const passwordHashed = await hash(passwordPlain, 15);
    const accessToken = await hash(userStruct?.email, 12);
    const refreshToken = await hash(userStruct?.userName, 12);
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
