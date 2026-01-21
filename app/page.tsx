'use client';

import { useState, useEffect } from 'react';
import { Transaction } from './types';
import { loadTransactions, saveTransactions } from './utils/storage';
import {
  filterTransactionsByMonth,
  calculateMonthlyStats,
  calculateCategoryBreakdown,
  calculateTotalBalance,
  getCurrentYearMonth,
} from './utils/calculations';
import OverviewTab from './components/OverviewTab';
import HistoryTab from './components/HistoryTab';
import BreakdownTab from './components/BreakdownTab';

type Tab = 'overview' | 'history' | 'breakdown';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleEditTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalBalance = calculateTotalBalance(transactions);
  const monthlyTransactions = filterTransactionsByMonth(transactions, selectedMonth);
  const monthlyStats = calculateMonthlyStats(monthlyTransactions);
  const incomeBreakdown = calculateCategoryBreakdown(monthlyTransactions, 'income');
  const expenseBreakdown = calculateCategoryBreakdown(monthlyTransactions, 'expense');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            家計簿アプリ
          </h1>

          {/* Month Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              表示月:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                概要
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                履歴
              </button>
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'breakdown'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                内訳
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <OverviewTab
              totalBalance={totalBalance}
              monthlyIncome={monthlyStats.totalIncome}
              monthlyExpense={monthlyStats.totalExpense}
              onAddTransaction={handleAddTransaction}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab
              transactions={monthlyTransactions}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          {activeTab === 'breakdown' && (
            <BreakdownTab
              incomeBreakdown={incomeBreakdown}
              expenseBreakdown={expenseBreakdown}
            />
          )}
        </div>
      </div>
    </div>
  );
}
