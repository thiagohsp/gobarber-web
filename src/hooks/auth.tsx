import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

interface AuthData {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthData>(() => {
    const token = localStorage.getItem('@GoB:token');
    const user = localStorage.getItem('@GoB:user');

    // testa se os valores existem
    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    // assina objeto nulo como AuthState pro typescript
    return {} as AuthData;
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoB:token');
    localStorage.removeItem('@GoB:user');

    setData({} as AuthData);
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoB:token', token);
    localStorage.setItem('@GoB:user', JSON.stringify(user));
    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({
      token,
      user,
    });
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoB:token', data.token);
      localStorage.setItem('@GoB:user', JSON.stringify(user));
      api.defaults.headers.authorization = `Bearer ${data.token}`;
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
