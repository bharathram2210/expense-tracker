
import React from 'react';
import { SpendingSummary } from '../types';

interface DashboardProps {
  summary: SpendingSummary;
}

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    // Adjusted size for a more compact look
    const radius = 40; 
    const stroke = 7;
    // Corrected normalizedRadius calculation for accurate circle rendering
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage > 100) return '#ef4444'; // red-500
        if (percentage > 80) return '#f59e0b'; // amber-500
        return '#22c55e'; // green-500
    };

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            className="-rotate-90"
        >
            <circle
                stroke="#e5e7eb" // gray-200
                className="dark:stroke-gray-700"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke={getColor()}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, strokeLinecap: 'round' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-500 ease-in-out"
            />
        </svg>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ summary }) => {
    const { totalBudgetThisMonth, thisMonth } = summary;
    const remainingBudget = totalBudgetThisMonth - thisMonth;
    const percentageUsed = totalBudgetThisMonth > 0 ? (thisMonth / totalBudgetThisMonth) * 100 : 0;
    
    const getProgressBarColor = () => {
        if (percentageUsed > 100) return 'bg-red-500';
        if (percentageUsed > 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg flex items-center gap-4">
            {/* Left side: Circular Progress */}
            <div className="relative flex-shrink-0">
                <CircularProgress percentage={percentageUsed} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Used</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{percentageUsed.toFixed(0)}%</span>
                </div>
            </div>

            {/* Right side: Details */}
            <div className="flex-1 w-full">
                <div className="flex justify-between items-baseline">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                        ₹{remainingBudget.toFixed(2)}
                    </p>
                </div>
                
                {/* Linear Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 my-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressBarColor()}`}
                        style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                    ></div>
                </div>

                {/* Spent vs Total */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Spent: ₹{thisMonth.toFixed(2)}</span>
                    <span>Budget: ₹{totalBudgetThisMonth.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
