import { FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-linear-(--gradient-primary) min-h-screen flex flex-col items-center justify-center'>
      <div className='flex items-center gap-2'>
        <FaSpinner className='text-text-body animate-spin text-2xl' />
        <span className='text-text-body text-xl'>{t('common.loading')}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
