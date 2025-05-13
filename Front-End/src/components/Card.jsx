import React from 'react';

const Card = ({ title, value, icon, bgColor = 'bg-white' }) => {
  return (
    <div className={`p-4 rounded-2xl shadow flex items-center space-x-4 ${bgColor}`}>
      <div className="p-3 rounded-full bg-white shadow">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Card;
