import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiSend } from 'react-icons/fi';

const MessageInput = ({
  newMessage,
  onMessageChange,
  onSendMessage,
  onTyping,
  onStopTyping
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-t border-gray-200 p-3">
      <form onSubmit={onSendMessage} className="flex gap-2 mx-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onTyping}
          onKeyUp={onStopTyping}
          placeholder={t('chat.typeMessage')}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm whitespace-nowrap"
        >
          <FiSend className="w-4 h-4" />
          {t('chat.send')}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
