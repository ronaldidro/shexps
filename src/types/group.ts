import type { User } from "./user";

export interface Group {
  id: number;
  name: string;
  createdAt: string;
  members: number;
  user: User;
}
