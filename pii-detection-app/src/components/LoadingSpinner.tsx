import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin mb-4"></div>
      <p className="text-white font-semibold text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner; 
