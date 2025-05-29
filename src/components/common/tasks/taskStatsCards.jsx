import { FaTasks, FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const TaskStatsCards = ({ stats }) => {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t('tasks.stats.total'),
      value: stats.total,
      icon: FaTasks,
      color: 'text-blue-600',
    },
    {
      title: t('tasks.stats.pending'),
      value: stats.pending,
      icon: FaClock,
      color: 'text-yellow-600',
    },
    {
      title: t('tasks.stats.inProgress'),
      value: stats.inProgress,
      icon: FaSpinner,
      color: 'text-indigo-600',
    },
    {
      title: t('tasks.stats.completed'),
      value: stats.completed,
      icon: FaCheckCircle,
      color: 'text-green-600',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className='bg-card-bg border border-border-light rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-text-body'>{card.title}</p>
                <p className={`text-3xl font-bold ${card.color} mt-2`}>{card.value}</p>
              </div>
              <div className={`p-4 rounded-full ${card.color} bg-opacity-20`}>
                <IconComponent className={`text-2xl ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStatsCards;
