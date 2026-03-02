import { hash } from "bcryptjs";
import crypto from "crypto";
export const createUserName = async () => {
  try {
    const userNameBuffer = crypto.randomBytes(20);
    const userName = userNameBuffer.toString("hex");
    return userName;
  } catch (error) {
    console.log("User name cannot be created because of error: ", error);
    return "Cannot make username";
  }
};
