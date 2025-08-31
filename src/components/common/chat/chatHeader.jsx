import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMoreVertical } from 'react-icons/fi';

const ChatHeader = ({ selectedUser, isConnected }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold backdrop-blur-sm">
            {selectedUser.user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white">{selectedUser.user.username}</h3>
            <p className="text-sm text-blue-100">
              {isConnected ? t('chat.online') : t('chat.offline')}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <FiMoreVertical className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
