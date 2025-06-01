import { FaRobot, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ChatHeader = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className='flex items-center justify-between px-6 py-4 bg-linear-(--gradient-text) rounded-t-lg flex-shrink-0'>
      <h5 className='flex items-center gap-2 text-xl font-semibold text-white'>
        <FaRobot /> {t('AI assistant')}
      </h5>
      <button
        onClick={onClose}
        className='cursor-pointer text-white hover:text-gray-200 transition-colors'
        aria-label='Close'
      >
        <FaTimes className='text-xl' />
      </button>
    </div>
  );
};

export default ChatHeader;
