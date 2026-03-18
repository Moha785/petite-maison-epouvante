'use client';

import { useState, useEffect } from 'react';

interface KeycloakState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  roles: string[];
  login: () => void;
  logout: () => void;
  register: () => void;
  loading: boolean;
}

let keycloakInstance: any = null;
let keycloakInitialized = false;
let keycloakInitializing = false;
const listeners: Array<() => void> = [];

const notifyListeners = () => listeners.forEach(l => l());

export function useKeycloak(): KeycloakState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const syncState = () => {
    if (!keycloakInstance) return;
    const authenticated = keycloakInstance.authenticated || false;
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setUsername(keycloakInstance.tokenParsed?.preferred_username || null);
      setToken(keycloakInstance.token || null);
      setRoles(keycloakInstance.realmAccess?.roles || []);
    } else {
      setUsername(null);
      setToken(null);
      setRoles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const listener = () => syncState();
    listeners.push(listener);

    const initKeycloak = async () => {
      if (typeof window === 'undefined') return;

      const Keycloak = (await import('keycloak-js')).default;

      if (!keycloakInstance) {
        keycloakInstance = new Keycloak({
          url: 'http://localhost:8180',
          realm: 'pme',
          clientId: 'pme-frontend',
        });
      }

      if (keycloakInitialized) {
        syncState();
        return;
      }

      if (keycloakInitializing) {
        const wait = setInterval(() => {
          if (keycloakInitialized) {
            clearInterval(wait);
            syncState();
          }
        }, 100);
        return;
      }

      try {
        keycloakInitializing = true;
        await keycloakInstance.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });
        keycloakInitialized = true;
        keycloakInitializing = false;
        notifyListeners();
      } catch (e) {
        console.error('Keycloak init failed', e);
        keycloakInitialized = false;
        keycloakInitializing = false;
        setLoading(false);
      }
    };

    initKeycloak();

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const login = () => keycloakInstance?.login();
  const logout = () => {
    keycloakInitialized = false;
    keycloakInstance?.logout({ redirectUri: 'http://localhost:3000' });
  };
  const register = () => keycloakInstance?.register({ redirectUri: 'http://localhost:3000' });

  return { isAuthenticated, username, token, roles, login, logout, register, loading };
}
