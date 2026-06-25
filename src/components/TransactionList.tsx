/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, ReceiptText, RefreshCw } from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onClearAll?: () => void;
  currencySymbol?: string;
}

export default function TransactionList({
  transactions,
  onDelete,
  onClearAll,
  currencySymbol = '$',
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');

  const categories: Category[] = ['Food', 'Transport', 'Bills', 'Shopping', 'Other'];

  // Filter and Sort logic
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((t) => t.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'amount-high') return b.amount - a.amount;
      if (sortBy === 'amount-low') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, selectedType, selectedCategory, sortBy]);

  return (
    <div
      id="transaction-list-container"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-3">
        <div>
          <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2 text-lg">
            <ReceiptText className="w-5 h-5 text-indigo-500" />
            History
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} records
          </p>
        </div>

        {transactions.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            id="clear-all-btn"
            className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                id="search-transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search description..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-medium transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                id="filter-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-medium cursor-pointer appearance-none"
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-medium cursor-pointer appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-medium cursor-pointer appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Highest Amount</option>
                <option value="amount-low">Lowest Amount</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Transactions List */}
          <div id="transactions-scroll-area" className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            <AnimatePresence initial={false} mode="popLayout">
              {filteredAndSortedTransactions.length > 0 ? (
                filteredAndSortedTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={onDelete}
                    currencySymbol={currencySymbol}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-xl"
                >
                  No match found for filters or search query.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Entirely Empty State */
        <div id="empty-state" className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
            <ReceiptText className="w-8 h-8" />
          </div>
          <p className="font-semibold text-slate-700 text-base">No transactions yet</p>
          <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
            Your logs are empty. Start keeping track of your finance by inserting your first record.
          </p>
        </div>
      )}
    </div>
  );
}
