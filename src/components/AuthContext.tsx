import { createContext, useContext, useState, ReactNode } from 'react';
import { setAuthToken as setApiToken } from '../utils/api';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider ({ children }: { children: ReactNode; }) {
  const [token, setToken] = useState<string | null>(null);

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    setApiToken(newToken); // Sync with API utility
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: updateToken,
        isAuthenticated: !!token,
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
