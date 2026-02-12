import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setAuthToken as setApiToken } from '../utils/api';

interface User {
  role: string;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider ({ children }: { children: ReactNode; }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const decodeToken = (token: string): User | null => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return { role: decoded.role };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    setApiToken(newToken); // Sync with API utility
    
    if (newToken) {
      const decodedUser = decodeToken(newToken);
      setUser(decodedUser);
    } else {
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: updateToken,
        isAuthenticated: !!token,
        user,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth () {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
