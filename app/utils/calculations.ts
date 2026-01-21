import { Transaction, MonthlyStats, CategoryBreakdown, Category } from '../types';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

export const filterTransactionsByMonth = (
  transactions: Transaction[],
  yearMonth: string // format: 'YYYY-MM'
): Transaction[] => {
  const [year, month] = yearMonth.split('-').map(Number);
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  return transactions.filter((t) => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

export const calculateMonthlyStats = (transactions: Transaction[]): MonthlyStats => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

export const calculateCategoryBreakdown = (
  transactions: Transaction[],
  type: 'income' | 'expense'
): CategoryBreakdown[] => {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<Category, number>();
  filtered.forEach((t) => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  });

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  try {
    return format(parseISO(date), 'yyyy/MM/dd');
  } catch {
    return date;
  }
};

export const getCurrentYearMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};
