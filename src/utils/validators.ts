import  z  from "../lib/zod";
import { User } from "../types/userTypes";

const ZodUser = {
  firstname: z.string().minLength(5),
  lastname: z.string(),
  username: z.string().minLength(5),
  email: z.email()
}


export async function validateSignUpUser(userData: User) {
  try {
    const validated = z.object(ZodUser).safeParse(userData)
  } catch (error) {
    console.error(
      "Zod Validation failed for SignUpUser Data with error: ",
      error,
    );
  }
}
