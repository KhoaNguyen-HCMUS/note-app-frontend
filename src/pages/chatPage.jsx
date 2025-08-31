import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { getChatUsers, searchUsers, getMessages, sendMessage, markAsRead } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
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
        // Đảm bảo results luôn là array
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
        // Đảm bảo prev luôn là array
        const currentMessages = Array.isArray(prev) ? prev : [];
        return [...currentMessages, message];
      });
      if (selectedUser && message.senderId === selectedUser.user._id) {
        markAsRead(message.senderId);
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
          // Đảm bảo prev luôn là array
          const currentMessages = Array.isArray(prev) ? prev : [];
          return [...currentMessages, messageData];
        });

        socketSendMessage(selectedUser.user._id, newMessage);

        setNewMessage('');
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

  // Handler functions
  const handleUserSelect = (chatUser) => {
    setSelectedUser(chatUser);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchUserSelect = (chatUser) => {
    setSelectedUser(chatUser);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleMessageChange = (value) => {
    setNewMessage(value);
  };

  return (
    <div className='flex h-[calc(80vh)] bg-gray-50'>
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
  );
};

export default ChatPage;
