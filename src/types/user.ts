export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface AccountForm extends UpdateUserPayload {
  passwordConfirmation?: string;
}
