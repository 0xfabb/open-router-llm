import { prisma } from "../lib/prisma";
import { APIKey, ServiceResult } from "../types/userTypes";

export async function getApiKey(
  userName: string,
  project: string,
): Promise<ServiceResult<APIKey>> {
  try {
    const apikey = await prisma.aPIKey.findUnique({
      where: {
        userName: userName,
      },
    });
    return apikey;
  } catch (error) {
    console.error(
      "User service panicked for get api key route with error :",
      error,
    );
  }
}
