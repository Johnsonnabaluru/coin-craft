/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { PieChart, DollarSign, TrendingDown } from 'lucide-react';
import { Transaction, Category } from '../types';

interface CategoryChartProps {
  transactions: Transaction[];
  currencySymbol?: string;
}

const CATEGORIES: Category[] = ['Food', 'Transport', 'Bills', 'Shopping', 'Other'];

// Custom colors and border styles for categories
const categoryStyleMap: Record<Category, { fill: string; bg: string; text: string }> = {
  Food: { fill: '#f97316', bg: 'bg-orange-500', text: 'text-orange-600' },     // Orange
  Transport: { fill: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-600' },     // Blue
  Bills: { fill: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-600' },       // Amber
  Shopping: { fill: '#a855f7', bg: 'bg-purple-500', text: 'text-purple-600' },   // Purple
  Other: { fill: '#64748b', bg: 'bg-slate-500', text: 'text-slate-600' },       // Slate
};

export default function CategoryChart({ transactions, currencySymbol = '$' }: CategoryChartProps) {
  // Derive category totals and percentages for EXPENSES
  const { categoryData, totalExpense } = useMemo(() => {
    // Filter out only expenses
    const expensesOnly = transactions.filter((t) => t.type === 'expense');
    const total = expensesOnly.reduce((sum, t) => sum + t.amount, 0);

    // Initialize map
    const categoryTotals: Record<Category, number> = {
      Food: 0,
      Transport: 0,
      Bills: 0,
      Shopping: 0,
      Other: 0,
    };

    // Calculate totals
    expensesOnly.forEach((t) => {
      if (categoryTotals[t.category] !== undefined) {
        categoryTotals[t.category] += t.amount;
      } else {
        categoryTotals.Other += t.amount;
      }
    });

    // Map to list with styling and percentage calculations
    const data = CATEGORIES.map((cat) => {
      const amt = categoryTotals[cat];
      const pct = total > 0 ? (amt / total) * 100 : 0;
      return {
        category: cat,
        amount: amt,
        percentage: parseFloat(pct.toFixed(1)),
        style: categoryStyleMap[cat],
      };
    }).sort((a, b) => b.amount - a.amount); // Sort by highest spending first

    return { categoryData: data, totalExpense: total };
  }, [transactions]);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
      .format(val)
      .replace('$', currencySymbol);
  };

  // SVG parameters for standard donut visual representation
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Compute accumulated stroke offsets for donut arcs
  let accumulatedPercent = 0;
  const donutArcs = useMemo(() => {
    return categoryData
      .filter((d) => d.percentage > 0)
      .map((d) => {
        const strokeDashOffset = circumference - (d.percentage / 100) * circumference;
        const rotationAngle = (accumulatedPercent / 100) * 360;
        accumulatedPercent += d.percentage;
        return {
          ...d,
          strokeDashOffset,
          rotationAngle,
        };
      });
  }, [categoryData, circumference]);

  return (
    <div
      id="category-chart-container"
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
        <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-500" />
          Spending Breakdown
        </h3>
        <span className="text-xs text-slate-400 font-medium">Expenses by category</span>
      </div>

      {totalExpense > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-grow">
          {/* Donut Chart Visual */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background base circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="fill-none stroke-slate-50"
                  strokeWidth={strokeWidth}
                />
                {/* Render colored donut arcs */}
                {donutArcs.map((arc, index) => (
                  <circle
                    key={arc.category}
                    cx="60"
                    cy="60"
                    r={radius}
                    className="fill-none transition-all duration-500"
                    stroke={arc.style.fill}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={arc.strokeDashOffset}
                    strokeLinecap="round"
                    style={{
                      transformOrigin: '60px 60px',
                      transform: `rotate(${arc.rotationAngle}deg)`,
                    }}
                  />
                ))}
              </svg>
              {/* Central text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <TrendingDown className="w-5 h-5 text-slate-400 mb-0.5" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Total Spent
                </span>
                <span className="text-sm font-extrabold text-slate-800 font-display mt-1">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            </div>
          </div>

          {/* List and Linear Progress Bars */}
          <div className="sm:col-span-7 space-y-4">
            {categoryData.map((data, idx) => {
              const hasSpending = data.amount > 0;
              return (
                <div key={data.category} className="space-y-1.5" id={`chart-category-row-${data.category}`}>
                  <div className="flex justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${data.style.bg}`} />
                      <span className="text-slate-600">{data.category}</span>
                    </div>
                    <div className="text-right space-x-1">
                      <span className="text-slate-900 font-bold">{formatCurrency(data.amount)}</span>
                      {hasSpending && (
                        <span className="text-slate-400 font-normal">({data.percentage}%)</span>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Bar Indicator */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.percentage}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}
                      className={`h-full ${data.style.bg}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div id="chart-empty-state" className="flex flex-col items-center justify-center py-12 text-center flex-grow">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-3 border border-slate-100/60">
            <PieChart className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-700 text-sm">No expenses to display</p>
          <p className="text-xs text-slate-400 max-w-xs mt-1 px-4 leading-relaxed">
            Visual graphs will automatically update once you record any expense item in your log.
          </p>
        </div>
      )}
    </div>
  );
}
