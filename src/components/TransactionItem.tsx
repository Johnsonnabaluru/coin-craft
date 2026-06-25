/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ComponentType } from 'react';
import { motion } from 'motion/react';
import { Trash2, Utensils, Car, Receipt, ShoppingBag, Coins } from 'lucide-react';
import { Transaction, Category } from '../types';

interface TransactionItemProps {
  key?: any;
  transaction: Transaction;
  onDelete: (id: string) => void;
  currencySymbol?: string;
}

// Map categories to visual icons and elegant colors
const categoryConfig: Record<Category, { icon: ComponentType<any>; bg: string; color: string }> = {
  Food: { icon: Utensils, bg: 'bg-orange-50', color: 'text-orange-600' },
  Transport: { icon: Car, bg: 'bg-blue-50', color: 'text-blue-600' },
  Bills: { icon: Receipt, bg: 'bg-amber-50', color: 'text-amber-600' },
  Shopping: { icon: ShoppingBag, bg: 'bg-purple-50', color: 'text-purple-600' },
  Other: { icon: Coins, bg: 'bg-slate-100', color: 'text-slate-600' },
};

export default function TransactionItem({
  transaction,
  onDelete,
  currencySymbol = '$',
}: TransactionItemProps): React.ReactElement {
  const { id, description, amount, category, type, date } = transaction;
  const config = categoryConfig[category] || categoryConfig.Other;
  const CategoryIcon = config.icon;

  const isExpense = type === 'expense';

  // Format date nicely
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Format amount
  const formatAmount = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
      .format(val)
      .replace('$', currencySymbol);
  };

  return (
    <motion.div
      id={`transaction-item-${id}`}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Category Icon */}
        <div className={`p-3 rounded-xl shrink-0 ${config.bg} ${config.color}`}>
          <CategoryIcon className="w-5 h-5" />
        </div>

        {/* Details */}
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate pr-2" title={description}>
            {description}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
              {category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {formatDate(date)}
            </span>
          </div>
        </div>
      </div>

      {/* Action and Amount */}
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`font-semibold text-sm font-mono whitespace-nowrap ${
            isExpense ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {isExpense ? '-' : '+'}
          {formatAmount(amount)}
        </span>

        <button
          onClick={() => onDelete(id)}
          id={`delete-btn-${id}`}
          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200 cursor-pointer"
          title="Delete record"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>
    </motion.div>
  );
}
