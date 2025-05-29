import { useTranslation } from 'react-i18next';

const TaskFilters = ({ statusFilter, priorityFilter, onStatusChange, onPriorityChange }) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: '', label: t('tasks.filters.allStatuses') },
    { value: 'pending', label: t('tasks.status.pending') },
    { value: 'in-progress', label: t('tasks.status.inProgress') },
    { value: 'completed', label: t('tasks.status.completed') },
    { value: 'cancelled', label: t('tasks.status.cancelled') },
  ];

  const priorityOptions = [
    { value: '', label: t('tasks.filters.allPriorities') },
    { value: 'low', label: t('tasks.priority.low') },
    { value: 'medium', label: t('tasks.priority.medium') },
    { value: 'high', label: t('tasks.priority.high') },
  ];

  return (
    <div className='border-t border-border-lgiht pt-4 mt-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-primary mb-2'>{t('tasks.filters.status')}</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className='cursor-pointer bg-card-bg text-primary w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-primary mb-2'>{t('tasks.filters.priority')}</label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className='cursor-pointer bg-card-bg text-primary w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
