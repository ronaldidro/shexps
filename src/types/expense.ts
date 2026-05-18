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
  createdAt: string;
  user: User;
  details: ExpenseDetail[];
}
