export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
}

export interface APIKey {
  userName: string;
  project: string;
  key: string;
}

export interface NewUser {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  isEmailVerified: string;
  accessToken: string;
  refreshToken: string;
  tokenExpires: Date;
}

export interface ServiceResult {
  success: boolean;
  data: object;
  statusCode: BigInt;
}

class llmUser implements User {
  constructor() {}
}
