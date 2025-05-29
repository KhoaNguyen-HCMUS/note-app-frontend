import { FaTasks, FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const TaskStatsCards = ({ stats }) => {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t('tasks.stats.total'),
      value: stats.total,
      icon: FaTasks,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: t('tasks.stats.pending'),
      value: stats.pending,
      icon: FaClock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: t('tasks.stats.inProgress'),
      value: stats.inProgress,
      icon: FaSpinner,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: t('tasks.stats.completed'),
      value: stats.completed,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium mb-1'>{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <IconComponent className='text-white text-xl' />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStatsCards;
