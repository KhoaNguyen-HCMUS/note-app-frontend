import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UpcomingTasks = ({ upcomingTasks }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('tasks.today');
    if (diffDays === 1) return t('tasks.tomorrow');
    if (diffDays === -1) return t('tasks.yesterday');
    if (diffDays < 0) return `${Math.abs(diffDays)} ${t('tasks.daysOverdue')}`;
    return `${diffDays} ${t('tasks.daysLeft')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-text-body';
    }
  };

  return (
    <div className='bg-card-bg border border-border-light rounded-xl p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-primary flex items-center'>
          <FaCalendarAlt className='mr-2 text-purple-600' />
          {t('dashboard.upcomingTasks')}
        </h2>
        <button
          onClick={() => navigate('/tasks')}
          className='cursor-pointer text-button-bg hover:text-button-hover text-sm font-medium transition-colors'
        >
          {t('dashboard.viewAll')}
        </button>
      </div>
      <div className='space-y-3'>
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <div
              key={task._id}
              className='p-3 bg-card-bg border border-border-light rounded-lg hover:shadow-md transition-all cursor-pointer'
            >
              <h3 className='font-medium text-primary truncate'>{task.title}</h3>
              <div className='flex items-center justify-between mt-2'>
                <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)} bg-opacity-20`}>
                  {t(`tasks.priority.${task.priority}`)}
                </span>
                <span className='text-xs text-red-600 font-medium'>{formatDate(task.dueDate)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className='text-text-body text-center py-8'>{t('dashboard.noUpcomingTasks')}</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingTasks;
