
import React, { useState, useEffect } from 'react';
import { SpendingSummary } from '../types';
// import { generateNotificationMessage } from '../services/geminiService';
import { XIcon } from './icons';

interface NotificationPreviewProps {
  summary: SpendingSummary;
  onClose: () => void;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({ summary, onClose }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      setIsLoading(true);
      // const generatedMessage = await generateNotificationMessage(summary);
      // setMessage(generatedMessage);
      setIsLoading(false);
    };
    fetchMessage();
  }, [summary]);

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Daily Summary Notification</h2>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">Z</div>
            <span className="font-semibold text-gray-800 dark:text-gray-100">Zenith Finance</span>
          </div>
          <div className="bg-white dark:bg-gray-600 p-3 rounded-lg min-h-[120px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {isSent ? (
            <div className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md">
              Sent successfully!
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Send via WhatsApp'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPreview;
