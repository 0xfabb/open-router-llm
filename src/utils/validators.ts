import z from "../lib/zod";
import { User } from "../types/userTypes";

const ZodUser = z.object({
  firstname: z.string(),
  lastname: z.string(),
  userName: z.string(),
  email: z.email(),
});

export async function validateSignUpUser(userData: User) {
  try {
    const validated = ZodUser.safeParse(userData);
    if (!validated.success) {
      return validated.data;
    }
    return validated.success;
  } catch (error) {
    console.error(
      "Zod Validation failed for SignUpUser Data with error: ",
      error,
    );
    return "Couldn't validate payload";
  }
}
