import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (token && user) {
      const newSocket = io(import.meta.env.VITE_APP_API_URL , {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        newSocket.emit('user_online');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token, user]);

  const sendMessage = (receiverId, content, messageType = 'text') => {
    if (socket && isConnected) {
      socket.emit('private_message', {
        receiverId,
        content,
        messageType
      });
    }
  };

  const sendTyping = (receiverId) => {
    if (socket && isConnected) {
      socket.emit('typing', { receiverId });
    }
  };

  const sendStopTyping = (receiverId) => {
    if (socket && isConnected) {
      socket.emit('stop_typing', { receiverId });
    }
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    sendTyping,
    sendStopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
