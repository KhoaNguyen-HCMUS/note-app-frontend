import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMessageCircle } from 'react-icons/fi';
import ChatHeader from './chatHeader';
import MessageList from './messageList';
import MessageInput from './messageInput';

const ChatArea = ({
  selectedUser,
  messages,
  newMessage,
  typingUsers,
  messagesEndRef,
  isConnected,
  user,
  formatTime,
  onMessageChange,
  onSendMessage,
  onTyping,
  onStopTyping
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      {selectedUser ? (
        <>
          <ChatHeader selectedUser={selectedUser} isConnected={isConnected} />
          <MessageList
            messages={messages}
            user={user}
            selectedUser={selectedUser}
            typingUsers={typingUsers}
            messagesEndRef={messagesEndRef}
            formatTime={formatTime}
          />
          <MessageInput
            newMessage={newMessage}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
            onTyping={onTyping}
            onStopTyping={onStopTyping}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('chat.selectConversation')}</h3>
            <p className="text-gray-500">{t('chat.selectConversationDesc')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
