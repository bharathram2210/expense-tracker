
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Zenith Expense Tracker
        </h1>
      </div>
    </header>
  );
};

export default Header;
