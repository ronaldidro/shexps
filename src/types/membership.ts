import type { Group } from "./group";
import type { User } from "./user";

export interface Membership {
  id: string;
  user: User;
  group: Group;
}
