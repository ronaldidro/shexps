import type { Membership } from "./membership";
import type { User } from "./user";

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  members: number;
  user: User;
  memberships: Membership[];
}

export interface GroupPayload {
  name: string;
  members: string[];
}
