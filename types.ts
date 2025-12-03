
export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string; // ISO string format
}

export interface Category {
  id:string;
  name: string;
  budget: number;
  icon: string; // Emoji or icon identifier
}

export interface SpendingSummary {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  totalBudgetThisMonth: number;
}

export interface CategoryReportItem {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  currentPeriodTotal: number;
  previousPeriodTotal: number;
}
