import React, { createContext, useContext, useState } from 'react';
import { useTheme } from './ThemeContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { setTheme } = useTheme();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sentiNautUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeProperty, setActiveProperty] = useState(() => {
    const savedProp = localStorage.getItem('sentiNautActiveProp');
    return savedProp ? savedProp : user?.property || '';
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sentiNautUser', JSON.stringify(userData));
    setActiveProperty(userData.property || '');
    localStorage.setItem('sentiNautActiveProp', userData.property || '');
    if (userData?.dark_mode !== undefined) {
      setTheme(userData.dark_mode ? 'dark' : 'light');
    }
  };

  const logout = () => {
    setUser(null);
    setActiveProperty('');
    localStorage.removeItem('sentiNautUser');
    localStorage.removeItem('sentiNautActiveProp');
  };

  const switchProperty = (propName) => {
    setActiveProperty(propName);
    localStorage.setItem('sentiNautActiveProp', propName);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, activeProperty, setActiveProperty: switchProperty }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
