
import React from 'react';
import { Expense, Category } from '../types';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, categories }) => {

  const getCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
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
              <div className="flex items-center gap-4">
                <div className="text-2xl w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                    {category?.icon || '❓'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{expense.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category?.name || 'Uncategorized'} &bull; {format(new Date(expense.date), 'MMM d')}
                  </p>
                </div>
              </div>
              <p className="font-bold text-gray-900 dark:text-white">
                ₹{expense.amount.toFixed(2)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseList;
