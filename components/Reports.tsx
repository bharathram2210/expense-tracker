
import React, { useState } from 'react';
import { CategoryReportItem } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface ReportsProps {
  getCategorySpendingReport: () => {
    weekly: CategoryReportItem[];
    monthly: CategoryReportItem[];
  };
}

const ReportRow: React.FC<{ item: CategoryReportItem }> = ({ item }) => {
    const { categoryIcon, categoryName, currentPeriodTotal, previousPeriodTotal } = item;
    
    const difference = currentPeriodTotal - previousPeriodTotal;
    const isIncrease = difference > 0;
    const isSame = difference === 0;
    const percentageChange = previousPeriodTotal > 0 ? (difference / previousPeriodTotal) * 100 : (currentPeriodTotal > 0 ? 100 : 0);

    const getComparisonColor = () => {
        if (isSame) return 'text-gray-500 dark:text-gray-400';
        return isIncrease ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400';
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-3">
                <span className="text-2xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full">{categoryIcon}</span>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{categoryName}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                    ₹{currentPeriodTotal.toFixed(0)}
                </p>
                <div className={`flex items-center justify-end text-xs ${getComparisonColor()}`}>
                    {isSame ? (
                        <span>No change</span>
                    ) : (
                        <>
                            {isIncrease ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                            <span className="font-semibold ml-1">{Math.abs(percentageChange).toFixed(0)}%</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const Reports: React.FC<ReportsProps> = ({ getCategorySpendingReport }) => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const reportData = getCategorySpendingReport();

  const dataToDisplay = reportType === 'weekly' ? reportData.weekly : reportData.monthly;
  const hasData = dataToDisplay.some(item => item.currentPeriodTotal > 0 || item.previousPeriodTotal > 0);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reports</h2>
      
      <div className="flex justify-center mb-6">
          <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex space-x-1">
              <button
                  onClick={() => setReportType('weekly')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${reportType === 'weekly' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              >
                  Weekly
              </button>
              <button
                  onClick={() => setReportType('monthly')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${reportType === 'monthly' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              >
                  Monthly
              </button>
          </div>
      </div>

      {hasData ? (
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 font-medium">
            <span>CATEGORY</span>
            <span>TOTAL SPENT</span>
          </div>
          {dataToDisplay.map(item => <ReportRow key={item.categoryId} item={item} />)}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No spending data available for this period.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Log some expenses to see your report!</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
