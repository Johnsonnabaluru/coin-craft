/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense';

export type Category = 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string; // ISO string
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}
