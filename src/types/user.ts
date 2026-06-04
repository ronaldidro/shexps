import type { QueryParams } from "./pagination";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

type Role = "admin" | "guest";

export interface UserQueryParams extends QueryParams {
  role?: Role;
}
