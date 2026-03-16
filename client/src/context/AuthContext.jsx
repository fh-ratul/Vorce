import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const AuthContext = createContext(null);

const storedAuth = () => {
  const raw = localStorage.getItem('vorce-auth');
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(storedAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      const existing = storedAuth();

      if (!existing?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        const nextAuth = { ...data, token: existing.token };
        setAuth(nextAuth);
        localStorage.setItem('vorce-auth', JSON.stringify(nextAuth));
      } catch (error) {
        localStorage.removeItem('vorce-auth');
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, []);

  const persistAuth = (data) => {
    setAuth(data);
    localStorage.setItem('vorce-auth', JSON.stringify(data));
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistAuth(data);
    toast.success('Account created');
    return data;
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistAuth(data);
    toast.success('Welcome back');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vorce-auth');
    setAuth(null);
    toast.success('Signed out');
  };

  const updateUser = (updates) => {
    setAuth((current) => {
      const next = { ...current, ...updates };
      localStorage.setItem('vorce-auth', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth,
        token: auth?.token,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
