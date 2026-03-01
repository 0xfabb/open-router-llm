import { prisma } from "../lib/prisma";
import { APIKey, ServiceResult } from "../types/userTypes";

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
