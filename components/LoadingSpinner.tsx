import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      <p className="text-sm text-gray-400">搜尋真實故事中...</p>
    </div>
  );
};

export default LoadingSpinner;
