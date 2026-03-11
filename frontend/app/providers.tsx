'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '@/lib/keycloak';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  roles: string[];
  login: () => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: null,
  roles: [],
  login: () => {},
  logout: () => {},
  token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' })
      .then(authenticated => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setUsername(keycloak.tokenParsed?.preferred_username || null);
          setRoles(keycloak.realmAccess?.roles || []);
          setToken(keycloak.token || null);
        }
        setInitialized(true);
      })
      .catch(() => setInitialized(true));
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: 'http://localhost:3000' });

  if (!initialized) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, roles, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
