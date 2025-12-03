
import React from 'react';
import { Expense, Category } from '../types';
import { format } from 'date-fns';
import { TrashIcon } from './icons';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDeleteExpense: (expenseId: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, categories, onDeleteExpense }) => {

  const getCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const handleDelete = (expenseId: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      onDeleteExpense(expenseId);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No expenses logged yet.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Click the '+' button to add your first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {expenses.map((expense) => {
          const category = getCategory(expense.categoryId);
          return (
            <li key={expense.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                  {category?.icon || '❓'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{expense.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category?.name || 'Uncategorized'} &bull; {format(new Date(expense.date), 'MMM d')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-gray-900 dark:text-white">
                  ₹{expense.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => handleDelete(expense.id, expense.description)}
                  className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label="Delete expense"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseList;
