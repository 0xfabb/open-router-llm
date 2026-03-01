// import { prisma } from "../lib/prisma";
// import { APIKey, ServiceResult } from "../types/userTypes";

// export async function getApiKey(
//   userName: string,
//   project: string,
// ): Promise<ServiceResult<APIKey | undefined>>{
//   try {
//     const apikey = await prisma.aPIKey.findUnique({
//       where: {
//         userName: userName,
//       },
//     });
//     const returnData: ServiceResult<APIKey> = {
//       success: true,
//       data: apikey,
//     };
//     return returnData;
//   } catch (error) {
//     console.error(
//       "User service panicked for get api key route with error :",
//       error,
//     );
//     const returnDataErr: ServiceResult<APIKey | undefined> = {
//       success: false,
//       data: undefined,
//       error: "Some error occured",
//     };
//     return returnDataErr;
//   }
// }
