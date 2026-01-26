import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { setToken, removeToken, isAuthenticated, getUserEmail, setUserData, getUserData } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userData: any;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userData, setUserDataState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (authenticated) {
        const email = getUserEmail();
        const data = getUserData();
        setUserEmail(email);
        setUserDataState(data);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData?: any) => {
    setToken(token);
    if (userData) {
      setUserData(userData);
      setUserDataState(userData);
    }
    setIsAuth(true);
    const email = getUserEmail();
    setUserEmail(email);
  };

  const logout = () => {
    removeToken();
    setIsAuth(false);
    setUserEmail(null);
    setUserDataState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuth,
        userEmail,
        userData,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};