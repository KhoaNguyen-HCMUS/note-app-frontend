import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiSearch } from 'react-icons/fi';

const ChatSidebar = ({
  chatUsers,
  selectedUser,
  searchQuery,
  searchResults,
  isSearching,
  loading,
  onUserSelect,
  onSearchChange,
  onSearchUserSelect,
  formatTime,
  user
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-80 min-w-80 max-w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FiUsers className="text-blue-500" />
          {t('chat.title')}
        </h2>
        
        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('chat.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
             <div className="flex-1 overflow-y-auto min-h-0">
        {/* Search Results */}
        {searchQuery && (
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {isSearching ? t('chat.searching') : t('chat.searchResults')}
            </h3>
            {isSearching ? (
              <div className="text-center text-gray-500">{t('common.loading')}</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((chatUser) => (
                <div
                  key={chatUser.user._id}
                  onClick={() => onSearchUserSelect(chatUser)}
                  className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {chatUser.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">{chatUser.user.username}</h4>
                      <p className="text-xs text-gray-500">{chatUser.user.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">{t('chat.noSearchResults')}</p>
            )}
          </div>
        )}
        
        {/* Chat Users */}
        {loading ? (
          <div className="p-4 text-center text-gray-500">{t('common.loading')}</div>
        ) : chatUsers.length > 0 ? (
          chatUsers.map((chatUser) => (
            <div
              key={chatUser.user._id}
              onClick={() => onUserSelect(chatUser)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedUser?.user._id === chatUser.user._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {chatUser.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{chatUser.user.username}</h3>
                      {chatUser.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {chatUser.lastMessage.sender === user?.username ? 'You: ' : ''}
                          {chatUser.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {chatUser.unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mb-1">
                      {chatUser.unreadCount}
                    </div>
                  )}
                  {chatUser.lastMessage && (
                    <p className="text-xs text-gray-400">
                      {formatTime(chatUser.lastMessage.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">{t('chat.noConversations')}</p>
            <p className="text-xs mt-1">{t('chat.useSearchToStart')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
