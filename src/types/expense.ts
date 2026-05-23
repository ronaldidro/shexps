import type { Group } from "./group";
import type { User } from "./user";

interface ExpenseDetail {
  id: string;
  amount: string;
  user: User;
}

export interface Expense {
  id: string;
  description: string;
  amount: string;
  expensedAt: string;
  user: User;
  group: Group;
  details: ExpenseDetail[];
}

export interface ExpensePayload {
  group: string;
  expensedAt: string;
  description: string;
  amount: number;
  splitted: boolean;
  details: {
    user: string;
    amount: number;
  }[];
}
