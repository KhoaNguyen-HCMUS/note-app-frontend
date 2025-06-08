// src/components/dashboard/QuickActionCard.jsx
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const QuickActionCard = ({ icon: Icon, title, description, color, onClick }) => {
  const { t } = useTranslation();

  return (
    <div
      className='bg-card-bg border border-border-light rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-indigo-300'
      onClick={onClick}
    >
      <div className='flex items-center mb-4'>
        <div className={`p-3 rounded-full ${color} bg-opacity-20 mr-4`}>
          {Icon && <Icon className={`text-xl ${color || 'text-gray-500'}`} />}
        </div>
        <div>
          <h3 className='font-semibold text-primary'>{title}</h3>
          <p className='text-sm text-text-body'>{description}</p>
        </div>
      </div>
      <div className='flex items-center text-button-bg text-sm font-medium'>
        {t('dashboard.quickActions')} <FaArrowRight className='ml-2' />
      </div>
    </div>
  );
};

export default QuickActionCard;
