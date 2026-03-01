import { NewUser, User } from "../types/userTypes";
import { hash } from "bcryptjs";

export async function signUpService(userStruct: User): Promise<NewUser> {
  try {

} catch (error) {
    console.error("SignUp user service panicked with error: ", error);
  }
}
