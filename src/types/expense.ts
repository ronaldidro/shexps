import type { Group } from "./group";
import type { User } from "./user";
export interface ExpenseDetail {
  id: string;
  amount: string;
  user: User;
  expense: Expense;
}

export interface Expense {
  id: string;
  description: string;
  amount: string;
  expensedAt: string;
  user: User;
  group: Group;
  details: Pick<ExpenseDetail, "id" | "amount" | "user">[];
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

export interface ExpenseSummary {
  user: string;
  total: number;
  amount: number;
  debtors: {
    fullName: string;
    amount: number;
  }[];
}
