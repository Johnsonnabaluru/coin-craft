/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BalanceSummaryProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  currencySymbol?: string;
}

export default function BalanceSummary({
  balance,
  totalIncome,
  totalExpenses,
  currencySymbol = '$',
}: BalanceSummaryProps) {
  const isNegative = balance < 0;

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(Math.abs(amount))
      .replace('$', currencySymbol);
  };

  const totalTurnover = totalIncome + totalExpenses;
  const incomePercent = totalTurnover > 0 ? (totalIncome / totalTurnover) * 100 : 0;
  const expensePercent = totalTurnover > 0 ? (totalExpenses / totalTurnover) * 100 : 0;

  return (
    <div id="balance-summary-container" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Running Balance Card */}
      <motion.div
        id="balance-card"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
      >
        {/* Subtle Decorative Background Blob */}
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-full translate-x-8 translate-y-8 pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Balance</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl md:text-5xl font-extrabold font-display tracking-tight ${isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
                {isNegative ? '-' : ''}
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
          <div className={`p-4 rounded-2xl ${isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      {/* Income Card */}
      <motion.div
        id="income-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Income</span>
            <span className="text-2xl font-bold font-display text-emerald-600">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="w-full bg-emerald-50 h-1.5 mt-4 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${incomePercent}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-emerald-500 h-1.5 rounded-full"
          />
        </div>
      </motion.div>

      {/* Expenses Card */}
      <motion.div
        id="expenses-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Expenses</span>
            <span className="text-2xl font-bold font-display text-rose-600">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div className="w-full bg-rose-50 h-1.5 mt-4 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expensePercent}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-rose-500 h-1.5 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
