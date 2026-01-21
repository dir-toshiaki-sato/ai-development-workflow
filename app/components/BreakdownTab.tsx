'use client';

import { CategoryBreakdown } from '../types';
import { formatCurrency } from '../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BreakdownTabProps {
  incomeBreakdown: CategoryBreakdown[];
  expenseBreakdown: CategoryBreakdown[];
}

interface ChartData {
  category: string;
  amount: number;
  percentage: number;
  [key: string]: string | number;
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
];

export default function BreakdownTab({
  incomeBreakdown,
  expenseBreakdown,
}: BreakdownTabProps) {
  const incomeChartData: ChartData[] = incomeBreakdown.map((item) => ({
    category: item.category,
    amount: item.amount,
    percentage: item.percentage,
  }));

  const expenseChartData: ChartData[] = expenseBreakdown.map((item) => ({
    category: item.category,
    amount: item.amount,
    percentage: item.percentage,
  }));

  return (
    <div className="space-y-8">
      {/* Income Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
          収入の内訳
        </h3>
        {incomeBreakdown.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            収入のデータがありません
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {incomeBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      カテゴリ
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      金額
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      割合
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incomeBreakdown.map((item, index) => (
                    <tr
                      key={item.category}
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {item.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
          支出の内訳
        </h3>
        {expenseBreakdown.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            支出のデータがありません
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {expenseBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      カテゴリ
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      金額
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                      割合
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenseBreakdown.map((item, index) => (
                    <tr
                      key={item.category}
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {item.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
