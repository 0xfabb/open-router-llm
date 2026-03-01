import { hash } from "bcryptjs";

export const createUserName = async (email: string) => {
  try {
    const userNameHash = await hash(email, 15);
    const userName = userNameHash.slice(0, 8);
    return userName;
  } catch (error) {
    console.log("User name cannot be created because of error: ", error);
    return "Cannot make username";
  }
};
