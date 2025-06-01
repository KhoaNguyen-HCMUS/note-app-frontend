import { FaRobot, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ChatMessage from './chatMessage.jsx';
const ChatMessages = ({ messages, isLoading, messagesEndRef }) => {
  const { t } = useTranslation();

  return (
    <div className='flex-1 overflow-y-auto p-4 bg-card-bg'>
      {messages.length === 0 && (
        <div className='text-center text-text-muted py-8'>
          <FaRobot className='mx-auto text-4xl mb-4 text-accent' />
          <p>{t('How can I help you today?')}</p>
        </div>
      )}

      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} index={index} />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className='flex justify-start mb-4'>
          <div className='bg-border-light text-text-body p-4 rounded-lg rounded-bl-none'>
            <div className='flex items-center gap-2'>
              <FaSpinner className='animate-spin' />
              <span>Đang suy nghĩ...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
