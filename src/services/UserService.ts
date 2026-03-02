import { prisma } from "../lib/prisma";
import { apiKey, APIKey, ServiceResult } from "../types/userTypes";
import { hash } from "bcryptjs";

export async function getApiKeysService(
  userName: string,
): Promise<ServiceResult<APIKey[] | undefined>> {
  try {
    const apikey = await prisma.aPIKey.findMany({
      where: {
        userName: userName,
      },
    });
    const returnData = {
      success: true,
      data: apikey,
    };
    return returnData;
  } catch (error) {
    console.error(
      "User service panicked for get api key route with error :",
      error,
    );
    const returnDataErr = {
      success: false,
      data: undefined,
      error: "Some error occured",
    };
    return returnDataErr;
  }
}

export async function createApiKeyService(
  userName: string,
  project: string,
): Promise<ServiceResult<apiKey | undefined>> {
  try {
    const genKey = await hash(project, 15);

    const genKeyRecord = await prisma.aPIKey.create({
      data: {
        userName: userName,
        key: genKey,
        project: project,
      },
    });
    const returnData = {
      success: true,
      data: genKeyRecord,
    };
    return returnData;
  } catch (error) {
    console.log("The apikey gen service panicked internally");
    const returnDataErr = {
      success: false,
      data: undefined,
      error: "Some error occured",
    };
    return returnDataErr;
  }
}
