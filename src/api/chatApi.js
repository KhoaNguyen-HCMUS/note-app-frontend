import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const createApiInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: `${API_URL}/chat`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
};

export const getChatUsers = async () => {
  try {
    const api = createApiInstance();
    const response = await api.get('/users');
    console.log('API Response - getChatUsers:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat users:', error);
    throw error;
  }
};

export const searchUsers = async (email) => {
  try {
    const api = createApiInstance();
    const response = await api.get(`/search-users?email=${encodeURIComponent(email)}`);
    console.log('API Response - searchUsers:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const getMessages = async (userId) => {
  try {
    const api = createApiInstance();
    const response = await api.get(`/messages/${userId}`);
    console.log('API Response - getMessages:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (receiverId, content, messageType = 'text') => {
  try {
    const api = createApiInstance();
    const response = await api.post('/messages', {
      receiverId,
      content,
      messageType
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markAsRead = async (senderId) => {
  try {
    const api = createApiInstance();
    const response = await api.put(`/messages/read/${senderId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const api = createApiInstance();
    const response = await api.get('/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};
