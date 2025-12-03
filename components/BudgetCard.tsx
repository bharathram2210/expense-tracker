
import React, { useState, useRef, useEffect } from 'react';
import { Category, Expense } from '../types';
import { DotsVerticalIcon, PencilIcon, TrashIcon } from './icons';

interface BudgetCardProps {
  category: Category;
  expenses: Expense[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onUpdateCategory: (category: Category) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ category, expenses, onEdit, onDelete, onUpdateCategory }) => {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = category.budget - totalSpent;
  const percentage = category.budget > 0 ? (totalSpent / category.budget) * 100 : 0;

  const isOverspent = percentage > 100;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState(category.budget.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEditingBudget && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingBudget]);

  const handleBudgetUpdate = () => {
    const newBudget = parseFloat(newBudgetValue);
    if (!isNaN(newBudget) && newBudget >= 0) {
      onUpdateCategory({ ...category, budget: newBudget });
    }
    setIsEditingBudget(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBudgetUpdate();
    } else if (e.key === 'Escape') {
      setNewBudgetValue(category.budget.toString());
      setIsEditingBudget(false);
    }
  };

  const getProgressBarColor = () => {
    if (isOverspent) return 'bg-red-500';
    if (percentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRemainingColor = () => {
    if (remaining < 0) {
      return 'text-red-500';
    }
    const percentageRemaining = category.budget > 0 ? (remaining / category.budget) * 100 : 100;
    if (percentageRemaining < 20) {
      return 'text-yellow-500 dark:text-yellow-400';
    }
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className={`p-3 rounded-xl shadow-lg transition-all duration-300 flex flex-col ${isOverspent ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-800'} hover:shadow-xl hover:-translate-y-1`}>
      {/* Top section: Icon, Name vs Remaining, Menu */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="font-semibold text-md text-gray-800 dark:text-gray-100">{category.name}</h3>
        </div>
        <div className="flex items-start gap-2">
            <div className="text-right">
                <p className={`font-extrabold text-xl ${getRemainingColor()}`}>
                    ₹{remaining.toFixed(0)}
                </p>
            </div>
            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 -mt-1 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <DotsVerticalIcon className="h-5 w-5" />
                </button>
                {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-10">
                        <div className="py-1">
                            <button onClick={() => { onEdit(category); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <PencilIcon className="h-4 w-4" /> Edit
                            </button>
                            <button onClick={() => { onDelete(category.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <TrashIcon className="h-4 w-4" /> Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Bottom section: Progress Bar and detailed text */}
      <div className="mt-auto">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${getProgressBarColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          <span>
            ₹{totalSpent.toFixed(0)}
          </span>
          {isEditingBudget ? (
                <input
                  ref={inputRef}
                  type="number"
                  value={newBudgetValue}
                  onChange={(e) => setNewBudgetValue(e.target.value)}
                  onBlur={handleBudgetUpdate}
                  onKeyDown={handleKeyDown}
                  className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-right w-20 rounded-md p-0.5 border border-blue-500 ring-1 ring-blue-500 focus:outline-none"
                  />
            ) : (
                <span
                  onClick={() => setIsEditingBudget(true)}
                  className="cursor-pointer hover:underline"
                  title="Click to edit budget"
                >
                  <span className="text-gray-400 dark:text-gray-500">of </span>
                  ₹{category.budget.toFixed(0)}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
