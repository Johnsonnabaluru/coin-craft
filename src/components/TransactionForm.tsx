/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, ShoppingBag, DollarSign, ListFilter } from 'lucide-react';
import { TransactionType, Category } from '../types';

interface TransactionFormProps {
  onAddTransaction: (data: {
    description: string;
    amount: number;
    category: Category;
    type: TransactionType;
  }) => void;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [type, setType] = useState<TransactionType>('expense');
  const [error, setError] = useState('');

  const categories: Category[] = ['Food', 'Transport', 'Bills', 'Shopping', 'Other'];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Input Validation
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    // Call callback with form data
    onAddTransaction({
      description: description.trim(),
      amount: parsedAmount,
      category,
      type,
    });

    // Reset Form Fields
    setDescription('');
    setAmount('');
    setCategory('Food');
    setType('expense'); // Reset default back to expense
  };

  return (
    <form
      id="transaction-form"
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-1">
        <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-500" />
          Add Transaction
        </h3>
        <span className="text-xs text-slate-400 font-medium">Create a new record</span>
      </div>

      {/* Type Toggle Tabs (Income vs Expense) */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Transaction Type</label>
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            id="toggle-expense-btn"
            onClick={() => setType('expense')}
            className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              type === 'expense'
                ? 'bg-white text-rose-600 shadow-sm border border-rose-100/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            id="toggle-income-btn"
            onClick={() => setType('income')}
            className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              type === 'income'
                ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Description input */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
          Description
        </label>
        <div className="relative">
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Weekly Groceries"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Amount and Category Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount input */}
        <div className="space-y-1.5">
          <label htmlFor="amount" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
              $
            </span>
            <input
              type="number"
              id="amount"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Category select */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all font-medium cursor-pointer appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ListFilter className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          id="form-error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs font-medium text-rose-600 bg-rose-50/50 px-3 py-2 rounded-lg border border-rose-100"
        >
          {error}
        </motion.p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        id="submit-transaction-btn"
        className={`w-full py-2.5 rounded-lg font-bold text-white text-sm transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2 hover:shadow-md ${
          type === 'expense'
            ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
            : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
        }`}
      >
        <PlusCircle className="w-4 h-4" />
        Save {type === 'expense' ? 'Expense' : 'Income'}
      </button>
    </form>
  );
}
