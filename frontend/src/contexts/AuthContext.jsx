import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginCallback, setLoginCallbackState] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('@Barbershop:token');
    const user = localStorage.getItem('@Barbershop:user');

    console.log('AuthContext - useEffect - Token:', token);
    console.log('AuthContext - useEffect - User:', user);

    if (token && user) {
      const parsedUser = JSON.parse(user);
      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(parsedUser);
      console.log('AuthContext - useEffect - Usuário autenticado:', parsedUser);
    } else {
      console.log('AuthContext - useEffect - Nenhum token ou usuário encontrado');
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext - login - Iniciando login');
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      console.log('AuthContext - login - Resposta:', response.data);

      localStorage.setItem('@Barbershop:token', token);
      localStorage.setItem('@Barbershop:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(user);

      console.log('AuthContext - login - Usuário autenticado:', user);

      if (loginCallback) {
        loginCallback();
      }
    } catch (error) {
      console.error('AuthContext - login - Erro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('@Barbershop:token');
    localStorage.removeItem('@Barbershop:user');
    api.defaults.headers.authorization = undefined;
    setUser(null);
  };

  const setLoginSuccessCallback = (callback) => {
    setLoginCallbackState(callback);
  };

  const value = {
    signed: !!user,
    user,
    loading,
    login,
    logout,
    setLoginSuccessCallback,
  };

  console.log('AuthContext - Renderizando provider com valor:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 