import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/socketContext';
import { getChatUsers, searchUsers, getMessages, sendMessage, markAsRead } from '../api/chatApi';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ChatSidebar from '../components/common/chat/chatSidebar';
import ChatArea from '../components/common/chat/chatArea';

const ChatPage = () => {
  const { t } = useTranslation();
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showChatArea, setShowChatArea] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket, isConnected, sendMessage: socketSendMessage, sendTyping, sendStopTyping } = useSocket();
  const { user } = useAuth();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (showChatArea && selectedUser) {
      scrollToBottom();
    }
  }, [showChatArea, selectedUser, scrollToBottom]);

  useEffect(() => {
    const loadChatUsers = async () => {
      try {
        setLoading(true);
        const users = await getChatUsers();
        setChatUsers(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error('Error loading chat users:', error);
        toast.error(t('chat.errors.loadUsers'));
        setChatUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadChatUsers();
  }, [t]);

  const handleSearch = useCallback(
    async (query) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const results = await searchUsers(query);
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error('Error searching users:', error);
        toast.error(t('chat.errors.searchUsers'));
        setSearchResults([]); // Set empty array on error
      } finally {
        setIsSearching(false);
      }
    },
    [t]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    if (selectedUser) {
      const loadMessages = async () => {
        try {
          const messageData = await getMessages(selectedUser.user._id);
          setMessages(Array.isArray(messageData) ? messageData : []);
          await markAsRead(selectedUser.user._id);
        } catch (error) {
          console.error('Error loading messages:', error);
          toast.error(t('chat.errors.loadMessages'));
          setMessages([]);
        }
      };

      loadMessages();
    }
  }, [selectedUser, t, markAsRead]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      setMessages((prev) => {
        const currentMessages = Array.isArray(prev) ? prev : [];
        return [...currentMessages, message];
      });
      if (selectedUser && message.senderId === selectedUser.user._id) {
        markAsRead(message.senderId);
        setTimeout(() => scrollToBottom(), 100);
      }
    });

    socket.on('user_typing', (data) => {
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    });

    socket.on('user_stop_typing', (data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, selectedUser, markAsRead]);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !selectedUser) return;

      try {
        const messageData = await sendMessage(selectedUser.user._id, newMessage);
        setMessages((prev) => {
          const currentMessages = Array.isArray(prev) ? prev : [];
          return [...currentMessages, messageData];
        });

        socketSendMessage(selectedUser.user._id, newMessage);

        setNewMessage('');
        setTimeout(() => scrollToBottom(), 100);
      } catch {
        toast.error(t('chat.errors.sendMessage'));
      }
    },
    [newMessage, selectedUser, socketSendMessage, t]
  );

  const handleTyping = useCallback(() => {
    if (selectedUser) {
      sendTyping(selectedUser.user._id);
    }
  }, [selectedUser, sendTyping]);

  const handleStopTyping = useCallback(() => {
    if (selectedUser) {
      sendStopTyping(selectedUser.user._id);
    }
  }, [selectedUser, sendStopTyping]);

  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const handleUserSelect = (chatUser) => {
    setSelectedUser(chatUser);
    setShowChatArea(true);
    setTimeout(() => scrollToBottom(), 100);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchUserSelect = (chatUser) => {
    setSelectedUser(chatUser);
    setSearchQuery('');
    setSearchResults([]);
    setShowChatArea(true);
    setTimeout(() => scrollToBottom(), 100);
  };

  const handleMessageChange = (value) => {
    setNewMessage(value);
  };

  const handleBackToSidebar = () => {
    setShowChatArea(false);
  };

  return (
    <div className='flex h-[calc(80vh)] bg-gray-50'>
      {/* Mobile Layout */}
      <div className='lg:hidden flex w-full'>
        {/* Mobile Sidebar - Always visible */}
        <div className={`${showChatArea ? 'hidden' : 'block'} w-full flex-shrink-0`}>
          <ChatSidebar
            chatUsers={chatUsers}
            selectedUser={selectedUser}
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            loading={loading}
            onUserSelect={handleUserSelect}
            onSearchChange={handleSearchChange}
            onSearchUserSelect={handleSearchUserSelect}
            formatTime={formatTime}
            user={user}
          />
        </div>

        {/* Mobile Chat Area - Hidden by default, shown when user selected */}
        {showChatArea && (
          <div className='w-full flex-shrink-0'>
            <ChatArea
              selectedUser={selectedUser}
              messages={messages}
              newMessage={newMessage}
              typingUsers={typingUsers}
              messagesEndRef={messagesEndRef}
              isConnected={isConnected}
              user={user}
              formatTime={formatTime}
              onMessageChange={handleMessageChange}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
              onBackToSidebar={handleBackToSidebar}
            />
          </div>
        )}
      </div>

      {/* Tablet & Desktop Layout */}
      <div className='hidden lg:flex w-full'>
        {/* Sidebar */}
        <div className='w-80 xl:w-96 2xl:w-[420px] flex-shrink-0'>
          <ChatSidebar
            chatUsers={chatUsers}
            selectedUser={selectedUser}
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            loading={loading}
            onUserSelect={handleUserSelect}
            onSearchChange={handleSearchChange}
            onSearchUserSelect={handleSearchUserSelect}
            formatTime={formatTime}
            user={user}
          />
        </div>

        {/* Chat Area */}
        <div className='flex-1 flex flex-col'>
          <ChatArea
            selectedUser={selectedUser}
            messages={messages}
            newMessage={newMessage}
            typingUsers={typingUsers}
            messagesEndRef={messagesEndRef}
            isConnected={isConnected}
            user={user}
            formatTime={formatTime}
            onMessageChange={handleMessageChange}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
