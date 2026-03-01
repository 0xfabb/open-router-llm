export interface User {
  firstname?: string;
  lastname?: string;
  userName: string;
  email: string;
  password: string;
}

export interface APIKey {
  userName: string;
  project: string;
  key: string;
}

export interface CreatedUser {
  firstname: string | null;
  lastname: string | null;
  userName: string;
  email: string;
  isEmailVerified: boolean;
  accessToken: string;
  refreshToken: string | null;
  tokenExpires: Date | null;
  password: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
