/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Landmark, TrendingUp, HelpCircle, DollarSign, Euro, CircleAlert } from 'lucide-react';
import { Transaction, Category, TransactionType } from './types';
import BalanceSummary from './components/BalanceSummary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryChart from './components/CategoryChart';

// LocalStorage Keys
const STORAGE_KEY = 'coincraft_v2_transactions';
const CURRENCY_KEY = 'expense_tracker_currency';

// Premium Seed Data for the first-time user experience
const INITIAL_SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'seed-1',
    description: 'Monthly Salary Payment',
    amount: 3200.00,
    category: 'Other',
    type: 'income',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: 'seed-2',
    description: 'Weekly Organic Grocery Shopping',
    amount: 142.50,
    category: 'Food',
    type: 'expense',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 'seed-3',
    description: 'Fuel & Public Transit Passes',
    amount: 65.00,
    category: 'Transport',
    type: 'expense',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'seed-4',
    description: 'High-speed Fiber Internet & Streaming',
    amount: 89.90,
    category: 'Bills',
    type: 'expense',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'seed-5',
    description: 'Running Shoes Sale',
    amount: 110.00,
    category: 'Shopping',
    type: 'expense',
    date: new Date().toISOString(), // Today
  },
];

const CURRENCIES = [
  { symbol: '$', name: 'USD ($)' },
  { symbol: '€', name: 'EUR (€)' },
  { symbol: '£', name: 'GBP (£)' },
  { symbol: '₹', name: 'INR (₹)' },
  { symbol: '¥', name: 'JPY (¥)' },
];

export default function App() {
  /* ---------------------------------------------------------------------------
   * 1. STATE MANAGEMENT
   * ---------------------------------------------------------------------------
   * We initialize transactions with a lazy state initializer to check localStorage.
   * If the user is visiting for the first time, we pre-populate with seed data so
   * they immediately experience a populated, beautiful dashboard rather than empty states.
   */
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading transactions from localStorage', e);
    }
    // Default fallback to empty array for a clean slate
    return [];
  });

  // State for user currency selection
  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(CURRENCY_KEY);
      if (stored) {
        return stored;
      }
    } catch (e) {
      console.error('Error loading currency from localStorage', e);
    }
    return '$';
  });

  /* ---------------------------------------------------------------------------
   * 2. LOCALSTORAGE PERSISTENCE SIDE-EFFECTS
   * ---------------------------------------------------------------------------
   * Every time transactions or currency choices change, these effects automatically
   * run to update the browser storage to preserve the application state across refreshes.
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to write transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_KEY, currencySymbol);
    } catch (e) {
      console.error('Failed to write currency to localStorage', e);
    }
  }, [currencySymbol]);

  /* ---------------------------------------------------------------------------
   * 3. DERIVED STATE CALCULATIONS (REDUX/MEMOIZATION PATTERN)
   * ---------------------------------------------------------------------------
   * We avoid storing dependent values (like totalIncome, totalExpenses, and balance)
   * in state. Storing them in state risks desynchronization bugs.
   * Instead, we use useMemo to derive them on-the-fly whenever 'transactions' updates.
   */
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expenses += t.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  /* ---------------------------------------------------------------------------
   * 4. HANDLERS
   * ---------------------------------------------------------------------------
   */
  // Add new transaction record
  const handleAddTransaction = (newTx: {
    description: string;
    amount: number;
    category: Category;
    type: TransactionType;
  }) => {
    const txWithMeta: Transaction = {
      ...newTx,
      id: crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [txWithMeta, ...prev]);
  };

  // Delete a specific transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // Wipe all logs to start from scratch
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all transaction records? This action is permanent.')) {
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex flex-col antialiased">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg md:text-xl tracking-tight text-slate-900 leading-tight">
                CoinCraft
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Personal Ledger
              </p>
            </div>
          </div>

          {/* Controls: Currency Select */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden xs:inline">
                Currency:
              </span>
              <select
                id="currency-selector"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent cursor-pointer focus:outline-none"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.symbol} value={curr.symbol}>
                    {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Step 1: Metrics Overview Panel at the top */}
        <section id="metrics-panel" aria-label="Financial Summary">
          <BalanceSummary
            balance={balance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            currencySymbol={currencySymbol}
          />
        </section>

        {/* Step 2: Form, Chart & List Grid */}
        <section id="dashboard-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Forms & Analytics) - 5 Cols */}
          <div className="lg:col-span-5 space-y-8">
            <div id="add-transaction-section">
              <TransactionForm onAddTransaction={handleAddTransaction} />
            </div>
            
            <div id="analytics-section">
              <CategoryChart transactions={transactions} currencySymbol={currencySymbol} />
            </div>
          </div>

          {/* Right Column (Transaction Logs List) - 7 Cols */}
          <div className="lg:col-span-7 h-full">
            <div id="ledger-history-section" className="h-full">
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                onClearAll={handleClearAll}
                currencySymbol={currencySymbol}
              />
            </div>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Secure Local-First Ledger Engine Active</span>
          </div>
          <p className="text-slate-400">
            CoinCraft Expense Tracker &copy; {new Date().getFullYear()} &middot; Built with React &amp; Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
}
