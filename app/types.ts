export type TransactionType = 'income' | 'expense';

export type Category =
  | '給与'
  | 'ボーナス'
  | '副業'
  | 'その他収入'
  | '食費'
  | '交通費'
  | '住居費'
  | '水道光熱費'
  | '通信費'
  | '娯楽費'
  | '医療費'
  | '教育費'
  | 'その他支出';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  date: string; // ISO date string
  description: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
}
