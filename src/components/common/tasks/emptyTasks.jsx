import { FaTasks } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const EmptyTasks = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center py-16 px-4'>
      <div className='bg-indigo-100 p-6 rounded-full mb-6'>
        <FaTasks className='text-4xl text-indigo-600' />
      </div>
      <h3 className='text-2xl font-semibold text-gray-800 mb-3'>{t('tasks.empty.title')}</h3>
      <p className='text-gray-600 text-center max-w-md mb-6'>{t('tasks.empty.description')}</p>
      <div className='bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100'>
        <p className='text-sm text-gray-700 text-center'>{t('tasks.empty.tip')}</p>
      </div>
    </div>
  );
};

export default EmptyTasks;
