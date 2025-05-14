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

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(getStoredUsername());

  const login = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return <AuthContext.Provider value={{ token, username, login, logout }}>{children}</AuthContext.Provider>;
}
