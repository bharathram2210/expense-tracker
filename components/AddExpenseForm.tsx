
import React, { useState } from 'react';
import { Category, Expense } from '../types';
import { XIcon } from './icons';

interface AddExpenseFormProps {
  categories: Category[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'> & { date: string }) => void;
  onClose: () => void;
}

const amountSuggestions = [100, 200, 500];

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ categories, onAddExpense, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories.length > 0 ? categories[0].id : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && description && categoryId) {
      onAddExpense({
        amount: parseFloat(amount),
        description,
        categoryId,
        date: new Date().toISOString()
      });
    }
  };

  if (categories.length === 0) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">No Categories Found</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Please add a budget category before logging an expense.</p>
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    OK
                </button>
            </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md relative flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Expense</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XIcon className="h-6 w-6" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Amount Section */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-2xl font-bold">₹</span>
                        <input
                          type="number"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-4xl font-bold w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition"
                          required
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                        />
                    </div>
                    <div className="flex gap-2 mt-3">
                        {amountSuggestions.map(suggestion => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => setAmount(suggestion.toString())}
                              className="px-4 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              ₹{suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategoryId(cat.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                                    categoryId === cat.id
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-blue-500'
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description Section */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition"
                      required
                      placeholder='e.g., Coffee with friends'
                    />
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button 
                    type="submit" 
                    className="w-full px-4 py-3 text-base font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    disabled={!amount || !description || !categoryId}
                >
                    Add Expense
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
