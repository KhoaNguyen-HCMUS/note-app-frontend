import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';
import MessageContent from '../chatbot/messageContent';

const MessageList = ({ 
  messages, 
  user, 
  selectedUser, 
  typingUsers, 
  messagesEndRef, 
  formatTime 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      {messages.map((message, index) => {
        
        const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
        const isOwnMessage = senderId === user?.id || message.senderId === user?.id;
        
        return (
          <div
            key={message._id || index}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                isOwnMessage
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              <MessageContent message={{ type: isOwnMessage ? 'user' : 'bot', text: message.content }} />
              <p className={`text-xs mt-2 ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.createdAt || message.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
      
      {typingUsers.has(selectedUser.user._id) && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
            <div className="flex items-center gap-2">
              <FaSpinner className="animate-spin text-sm" />
              <span className="text-sm italic">{t('chat.typing')}</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
