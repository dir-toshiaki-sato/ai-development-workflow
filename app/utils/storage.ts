import { Transaction } from '../types';

const STORAGE_KEY = 'household_budget_transactions';

export const loadTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
};
