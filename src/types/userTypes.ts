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
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  tokens: Record<string, string>;
}

export interface loggedInUser {
  email: string;
  userName: string;
}

export interface apiKey {
  key: string;
  userName: string;
  project: string;
}
