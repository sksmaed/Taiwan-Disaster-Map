
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { User } from '../types';
import { ToastContext } from './ToastContext';

interface AuthContextType {
  user: User | null;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
  register: (user: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    // Check for saved user in local storage
    try {
      const savedUser = localStorage.getItem('disaster-map-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('disaster-map-user');
    }
  }, []);

  const getUsers = (): User[] => {
    try {
        const users = localStorage.getItem('disaster-map-users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        localStorage.removeItem('disaster-map-users');
        return [];
    }
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('disaster-map-users', JSON.stringify(users));
  };

  const login = async (name: string, password: string) => {
    const users = getUsers();
    const foundUser = users.find(u => u.name === name);

    if (foundUser && foundUser.password === password) {
      // Don't store password in the session state or the 'current user' local storage item
      const sessionUser = { name: foundUser.name, avatar: foundUser.avatar };
      localStorage.setItem('disaster-map-user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      showToast('登入成功！', 'success');
    } else {
      throw new Error("使用者名稱或密碼錯誤");
    }
  };

  const register = async (userData: User) => {
    const users = getUsers();
    if (users.some(u => u.name === userData.name)) {
      throw new Error("此使用者名稱已被註冊");
    }
    if (!userData.password) {
      throw new Error("密碼為必填項");
    }

    users.push(userData);
    saveUsers(users);

    // Automatically log in after registration
    const sessionUser = { name: userData.name, avatar: userData.avatar };
    localStorage.setItem('disaster-map-user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    showToast('註冊成功，已自動為您登入！', 'success');
  };

  const logout = () => {
    localStorage.removeItem('disaster-map-user');
    setUser(null);
    showToast('您已成功登出。', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
