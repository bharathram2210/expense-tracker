
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface ComparisonCardProps {
  title: string;
  currentAmount: number;
  previousAmount: number;
  periodLabel: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ title, currentAmount, previousAmount, periodLabel }) => {
  const difference = currentAmount - previousAmount;
  const isIncrease = difference > 0;
  const isSame = difference === 0;
  // A check to prevent division by zero if previousAmount is 0.
  const percentageChange = previousAmount > 0 ? (difference / previousAmount) * 100 : (currentAmount > 0 ? 100 : 0);

  const getComparisonColor = () => {
    if (isSame) return 'text-gray-500 dark:text-gray-400';
    // Spending more is bad (red), spending less is good (green)
    return isIncrease ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white my-1">
        ₹{currentAmount.toFixed(0)}
      </p>
      <div className={`flex items-center text-xs ${getComparisonColor()}`}>
        {isSame ? (
          <span>No change vs {periodLabel}</span>
        ) : (
          <>
            {isIncrease ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
            <span className="font-semibold">{Math.abs(percentageChange).toFixed(0)}%</span>
            <span className="ml-1">({isIncrease ? '+' : '-'}₹{Math.abs(difference).toFixed(0)})</span>
            <span className="ml-1">vs {periodLabel}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ComparisonCard;
