
import { useState, useEffect, useCallback } from 'react';
import { Category, Expense, SpendingSummary, CategoryReportItem } from '../types';
import { isToday, isYesterday, isThisWeek, isLastWeek, isThisMonth, isLastMonth } from '../utils/dateUtils';

// Default categories to give users a starting point
const defaultCategories: Category[] = [
  { id: '1', name: 'Groceries', budget: 10000, icon: '🛒' },
  { id: '2', name: 'Utilities', budget: 3000, icon: '💡' },
  { id: '3', name: 'Entertainment', budget: 5000, icon: '🎬' },
  { id: '4', name: 'Savings', budget: 20000, icon: '💰' },
];

export const useBudget = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const localData = localStorage.getItem('budget-categories');
      return localData ? JSON.parse(localData) : defaultCategories;
    } catch (error) {
      console.error("Error parsing categories from localStorage", error);
      return defaultCategories;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const localData = localStorage.getItem('budget-expenses');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error parsing expenses from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('budget-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budget-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...categoryData, id: new Date().toISOString() };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setExpenses(prev => prev.filter(exp => exp.categoryId !== categoryId));
  }, []);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expenseData, id: new Date().toISOString() };
    setExpenses(prev => [newExpense, ...prev]);
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
  }, []);

  const getCategoryExpenses = useCallback((categoryId: string) => {
    return expenses.filter(expense => expense.categoryId === categoryId && isThisMonth(new Date(expense.date)));
  }, [expenses]);

  const getSpendingSummary = useCallback((): SpendingSummary => {
    const summary: SpendingSummary = {
      today: 0,
      yesterday: 0,
      thisWeek: 0,
      lastWeek: 0,
      thisMonth: 0,
      lastMonth: 0,
      totalBudgetThisMonth: categories.reduce((acc, cat) => acc + cat.budget, 0),
    };

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (isToday(expenseDate)) summary.today += expense.amount;
      if (isYesterday(expenseDate)) summary.yesterday += expense.amount;
      if (isThisWeek(expenseDate)) summary.thisWeek += expense.amount;
      if (isLastWeek(expenseDate)) summary.lastWeek += expense.amount;
      if (isThisMonth(expenseDate)) summary.thisMonth += expense.amount;
      if (isLastMonth(expenseDate)) summary.lastMonth += expense.amount;
    });

    return summary;
  }, [expenses, categories]);

  const getCategorySpendingReport = useCallback(() => {
    const weekly: CategoryReportItem[] = [];
    const monthly: CategoryReportItem[] = [];

    categories.forEach(category => {
      const categoryExpenses = expenses.filter(exp => exp.categoryId === category.id);

      let thisWeekTotal = 0;
      let lastWeekTotal = 0;
      let thisMonthTotal = 0;
      let lastMonthTotal = 0;

      categoryExpenses.forEach(exp => {
        const expenseDate = new Date(exp.date);
        if (isThisWeek(expenseDate)) thisWeekTotal += exp.amount;
        if (isLastWeek(expenseDate)) lastWeekTotal += exp.amount;
        if (isThisMonth(expenseDate)) thisMonthTotal += exp.amount;
        if (isLastMonth(expenseDate)) lastMonthTotal += exp.amount;
      });

      weekly.push({
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        currentPeriodTotal: thisWeekTotal,
        previousPeriodTotal: lastWeekTotal,
      });

      monthly.push({
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        currentPeriodTotal: thisMonthTotal,
        previousPeriodTotal: lastMonthTotal,
      });
    });

    return { weekly, monthly };
  }, [categories, expenses]);

  return { categories, expenses, addCategory, updateCategory, deleteCategory, addExpense, deleteExpense, getCategoryExpenses, getSpendingSummary, getCategorySpendingReport };
};
