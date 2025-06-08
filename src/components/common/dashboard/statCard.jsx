import React from 'react';

const StatCard = ({ icon: Icon, title, value, color, bgColor, onClick }) => (
  <div
    className={`${bgColor} border border-border-light rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
    onClick={onClick}
  >
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm font-medium text-text-body'>{title}</p>
        <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
      </div>
      <div className={`p-4 rounded-full ${color} bg-opacity-20`}>
        {Icon && <Icon className={`text-2xl ${color || 'text-gray-500'}`} />}
      </div>
    </div>
  </div>
);

export default StatCard;
