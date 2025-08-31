import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Safely parse username from localStorage
  const getStoredUsername = () => {
    try {
      return localStorage.getItem('username') || null;
    } catch (error) {
      console.error('Error getting username from localStorage:', error);
      localStorage.removeItem('username');
      return null;
    }
  };

  const getStoredUserId = () => {
    try {
      return localStorage.getItem('userId') || null;
    } catch (error) {
      console.error('Error getting userId from localStorage:', error);
      localStorage.removeItem('userId');
      return null;
    }
  };

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(getStoredUsername());
  const [userId, setUserId] = useState(getStoredUserId());

  const login = (newToken, newUsername, newUserId) => {
    setToken(newToken);
    setUsername(newUsername);
    setUserId(newUserId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  };

  const user = {
    id: userId,
    username: username
  };

  return <AuthContext.Provider value={{ token, username, userId, user, login, logout }}>{children}</AuthContext.Provider>;
}
