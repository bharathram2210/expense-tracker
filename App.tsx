
import React, { useState } from 'react';
import { useBudget } from './hooks/useBudget';
import BudgetCard from './components/BudgetCard';
import AddExpenseForm from './components/AddExpenseForm';
import AddCategoryForm from './components/AddCategoryForm';
import EditCategoryForm from './components/EditCategoryForm';
import NotificationPreview from './components/NotificationPreview';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import { PlusIcon, ChartPieIcon, BellIcon, LayoutDashboardIcon, ClipboardListIcon, ChartBarIcon } from './components/icons';
import { Category } from './types';
import ComparisonCard from './components/ComparisonCard';
import Reports from './components/Reports';

// Helper component for Tab Buttons
interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-3 pb-2 text-xs transition-colors duration-200 ${isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
        }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="mt-1 font-medium">{label}</span>
    </button>
  );
};


const App: React.FC = () => {
  const {
    categories,
    expenses,
    addCategory,
    updateCategory,
    deleteCategory,
    addExpense,
    deleteExpense,
    getCategoryExpenses,
    getSpendingSummary,
    getCategorySpendingReport,
  } = useBudget();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const spendingSummary = getSpendingSummary();

  const handleOpenEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setEditCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all of its associated expenses.')) {
      deleteCategory(categoryId);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="px-4 pt-8 pb-28 max-w-4xl mx-auto">
        {activeTab === 'dashboard' && (
          <>
            <Dashboard summary={spendingSummary} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <ComparisonCard
                title="Today"
                currentAmount={spendingSummary.today}
                previousAmount={spendingSummary.yesterday}
                periodLabel="Yesterday"
              />
              <ComparisonCard
                title="This Week"
                currentAmount={spendingSummary.thisWeek}
                previousAmount={spendingSummary.lastWeek}
                periodLabel="Last Week"
              />
              <ComparisonCard
                title="This Month"
                currentAmount={spendingSummary.thisMonth}
                previousAmount={spendingSummary.lastMonth}
                periodLabel="Last Month"
              />
            </div>
          </>
        )}

        {activeTab === 'budgets' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budgets</h2>
              <button
                onClick={() => setAddCategoryModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-colors"
              >
                <ChartPieIcon className="h-5 w-5" />
                New Category
              </button>
            </div>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <BudgetCard
                    key={cat.id}
                    category={cat}
                    expenses={getCategoryExpenses(cat.id)}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteCategory}
                    onUpdateCategory={updateCategory}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">No budget categories yet.</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Click 'New Category' to get started!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Expenses</h2>
            <ExpenseList expenses={expenses} categories={categories} onDeleteExpense={deleteExpense} />
          </div>
        )}

        {activeTab === 'reports' && (
          <Reports getCategorySpendingReport={getCategorySpendingReport} />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-4 flex flex-col items-center gap-4 z-40">
        <button
          onClick={() => setAddExpenseModalOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110"
          aria-label="Add Expense"
        >
          <PlusIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Bottom Tab Navigation ------*/}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-4xl mx-auto flex justify-around">
          <TabButton
            label="Dashboard"
            icon={<LayoutDashboardIcon className="h-6 w-6" />}
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <TabButton
            label="Budgets"
            icon={<ChartPieIcon className="h-6 w-6" />}
            isActive={activeTab === 'budgets'}
            onClick={() => setActiveTab('budgets')}
          />
          <TabButton
            label="Expenses"
            icon={<ClipboardListIcon className="h-6 w-6" />}
            isActive={activeTab === 'expenses'}
            onClick={() => setActiveTab('expenses')}
          />
          <TabButton
            label="Reports"
            icon={<ChartBarIcon className="h-6 w-6" />}
            isActive={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          />
        </div>
      </div>


      {isAddExpenseModalOpen && (
        <AddExpenseForm
          categories={categories}
          onAddExpense={(expense) => {
            addExpense(expense);
            setAddExpenseModalOpen(false);
          }}
          onClose={() => setAddExpenseModalOpen(false)}
        />
      )}

      {isAddCategoryModalOpen && (
        <AddCategoryForm
          onAddCategory={(category) => {
            addCategory(category);
            setAddCategoryModalOpen(false);
          }}
          onClose={() => setAddCategoryModalOpen(false)}
        />
      )}

      {isEditCategoryModalOpen && categoryToEdit && (
        <EditCategoryForm
          category={categoryToEdit}
          onUpdateCategory={(updatedCat) => {
            updateCategory(updatedCat);
            setEditCategoryModalOpen(false);
          }}
          onClose={() => setEditCategoryModalOpen(false)}
        />
      )}

      {isNotificationModalOpen && (
        <NotificationPreview
          summary={spendingSummary}
          onClose={() => setNotificationModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
