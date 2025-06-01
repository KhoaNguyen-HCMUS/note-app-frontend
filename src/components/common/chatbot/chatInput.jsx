import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ChatInput = ({ input, setInput, onSubmit, isLoading }) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className='p-4 border-t border-border-light flex-shrink-0'>
      <div className='flex gap-2'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('Type a message...')}
          className='flex-1 p-3 border border-border-light rounded-lg bg-card-bg text-text-body
          focus:outline-none focus:ring-2 focus:ring-accent transition-all'
          disabled={isLoading}
        />
        <button
          type='submit'
          disabled={isLoading || !input.trim()}
          className='bg-button-bg cursor-pointer text-button-text p-3 rounded-lg hover:opacity-90 
          transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-w-[48px] flex items-center justify-center'
        >
          {isLoading ? <FaSpinner className='animate-spin' /> : <FaPaperPlane />}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
