import React, { useState } from 'react';
import { Category } from '../types';
import { XIcon } from './icons';

interface EditBudgetsModalProps {
  categories: Category[];
  onUpdateBudgets: (budgets: Record<string, number>) => void;
  onClose: () => void;
}

const EditBudgetsModal: React.FC<EditBudgetsModalProps> = ({ categories, onUpdateBudgets, onClose }) => {
  const [budgets, setBudgets] = useState<Record<string, string>>(() =>
    categories.reduce((acc, cat) => {
      acc[cat.id] = cat.budget.toString();
      return acc;
    }, {} as Record<string, string>)
  );

  const handleBudgetChange = (id: string, value: string) => {
    setBudgets(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Explicitly type the destructured parameters in the reduce function to correct a TypeScript inference issue.
    const numericBudgets = Object.entries(budgets).reduce((acc, [id, value]: [string, string]) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        acc[id] = numValue;
      }
      return acc;
    }, {} as Record<string, number>);
    onUpdateBudgets(numericBudgets);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative flex flex-col">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Monthly Budgets</h2>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 -mr-2 mb-4 flex-grow">
            {categories.map(cat => (
              <div key={cat.id}>
                <label htmlFor={`budget-${cat.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cat.icon} {cat.name}
                </label>
                <input
                  type="number"
                  id={`budget-${cat.id}`}
                  value={budgets[cat.id] || ''}
                  onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 500.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBudgetsModal;
