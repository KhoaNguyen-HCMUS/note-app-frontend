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
  user,
}) => {
  const { t } = useTranslation();

  return (
    <div className='bg-white border-r border-gray-200 flex flex-col h-full'>
      <div className='p-3 sm:p-4 border-b border-gray-200'>
        <h2 className='text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2'>
          <FiUsers className='text-blue-500' />
          {t('chat.title')}
        </h2>

        {/* Search Bar */}
        <div className='mt-3 sm:mt-4 relative'>
          <div className='relative'>
            <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder={t('chat.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
            />
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {/* Search Results */}
        {searchQuery && (
          <div className='py-3 px-3 border-b border-gray-100'>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>
              {isSearching ? t('chat.searching') : t('chat.searchResults')}
            </h3>
            {isSearching ? (
              <div className='text-center text-gray-500 text-sm py-2'>{t('common.loading')}</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((chatUser) => (
                <div
                  key={chatUser.user._id}
                  onClick={() => onSearchUserSelect(chatUser)}
                  className='py-2 px-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors rounded-md'
                >
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                      {chatUser.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className='flex-1 overflow-hidden'>
                      <h4 className='font-medium text-gray-800 text-sm truncate'>{chatUser.user.username}</h4>
                      <p className='text-xs text-gray-500 truncate'>{chatUser.user.email}</p>
                    </div>
                  </div>
                </div>
              ))
                         ) : (
               <p className='text-sm text-gray-500 py-2'>{t('chat.noSearchResults')}</p>
             )}
          </div>
        )}

        {loading ? (
          <div className='py-4 text-center text-gray-500'>{t('common.loading')}</div>
        ) : chatUsers.length > 0 ? (
          chatUsers.map((chatUser) => (
            <div
              key={chatUser.user._id}
              onClick={() => onUserSelect(chatUser)}
              className={`py-4 px-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedUser?.user._id === chatUser.user._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                                         <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0'>
                       {chatUser.user.username.charAt(0).toUpperCase()}
                     </div>
                    <div className='flex-1 min-w-0'>
                                             <div className='flex items-center justify-between'>
                         <h3 className='font-medium text-gray-800 text-base truncate'>{chatUser.user.username}</h3>
                         {chatUser.lastMessage && (
                           <p className='text-sm text-gray-400 ml-2'>{formatTime(chatUser.lastMessage.createdAt)}</p>
                         )}
                       </div>
                                             {chatUser.lastMessage && (
                         <div className='flex items-center justify-between mt-1'>
                           <p className='text-sm text-gray-500 truncate flex-1'>
                             {chatUser.lastMessage.sender === user?.username ? 'You: ' : ''}
                             {chatUser.lastMessage.content}
                           </p>
                           {chatUser.unreadCount > 0 && (
                             <div className='bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center ml-2 flex-shrink-0'>
                               {chatUser.unreadCount}
                             </div>
                           )}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
                 ) : (
           <div className='py-6 px-3 text-center text-gray-500'>
             <p className='text-base'>{t('chat.noConversations')}</p>
             <p className='text-sm mt-2'>{t('chat.useSearchToStart')}</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default ChatSidebar;
