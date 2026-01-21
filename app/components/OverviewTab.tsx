import { Transaction, Category, TransactionType } from '../types';
import { formatCurrency } from '../utils/calculations';

interface OverviewTabProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const incomeCategories: Category[] = ['給与', 'ボーナス', '副業', 'その他収入'];
const expenseCategories: Category[] = [
  '食費',
  '交通費',
  '住居費',
  '水道光熱費',
  '通信費',
  '娯楽費',
  '医療費',
  '教育費',
  'その他支出',
];

export default function OverviewTab({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  onAddTransaction,
}: OverviewTabProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const transaction: Omit<Transaction, 'id'> = {
      type: formData.get('type') as TransactionType,
      category: formData.get('category') as Category,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string,
      description: formData.get('description') as string,
    };

    onAddTransaction(transaction);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            総資産残高
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(totalBalance)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            今月の収入
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(monthlyIncome)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            今月の支出
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(monthlyExpense)}
          </p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          新しい取引を追加
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                取引タイプ
              </label>
              <select
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const categorySelect = e.currentTarget.form?.elements.namedItem(
                    'category'
                  ) as HTMLSelectElement;
                  if (categorySelect) {
                    categorySelect.value = '';
                  }
                }}
              >
                <option value="income">収入</option>
                <option value="expense">支出</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                カテゴリ
              </label>
              <select
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <optgroup label="収入">
                  {incomeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="支出">
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                金額
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                日付
              </label>
              <input
                type="date"
                name="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              説明
            </label>
            <input
              type="text"
              name="description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="取引の説明（任意）"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            追加
          </button>
        </form>
      </div>
    </div>
  );
}
