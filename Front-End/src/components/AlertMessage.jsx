import React from 'react';

const AlertMessage = ({ type, message, className = '' }) => {
  // Define alert styles based on type
  const alertStyles = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <div className={`p-4 border-l-4 rounded ${style} ${className}`} role="alert">
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default AlertMessage;
