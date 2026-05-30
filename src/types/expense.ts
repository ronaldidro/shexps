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
  splitted: boolean;
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

interface ExpenseSummaryDetail {
  fullName: string;
  amount: number;
}

export interface ExpenseSummary {
  user: string;
  expenses: number;
  amount: number;
  debts: number;
  debtors: ExpenseSummaryDetail[];
  creditors: ExpenseSummaryDetail[];
}
