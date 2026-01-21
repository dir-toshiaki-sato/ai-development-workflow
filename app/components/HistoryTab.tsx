import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';

interface HistoryTabProps {
  transactions: Transaction[];
  onEditTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
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

export default function HistoryTab({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}: HistoryTabProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            取引履歴
          </h3>
        </div>

        {sortedTransactions.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            取引履歴がありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    日付
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    タイプ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={onEditTransaction}
                    onDelete={onDeleteTransaction}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  onEdit: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const handleEdit = () => {
    const newAmount = prompt('新しい金額を入力してください:', String(transaction.amount));
    if (newAmount && !isNaN(Number(newAmount))) {
      const newDescription = prompt('説明を入力してください:', transaction.description);
      onEdit(transaction.id, {
        ...transaction,
        amount: Number(newAmount),
        description: newDescription || transaction.description,
      });
    }
  };

  const handleDelete = () => {
    if (confirm('この取引を削除してもよろしいですか?')) {
      onDelete(transaction.id);
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
        {formatDate(transaction.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            transaction.type === 'income'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {transaction.type === 'income' ? '収入' : '支出'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
        {transaction.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <span
          className={
            transaction.type === 'income'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {transaction.description || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={handleEdit}
          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
        >
          編集
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          削除
        </button>
      </td>
    </tr>
  );
}
