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

export function useKeycloak(): KeycloakState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setIsAuthenticated(keycloakInstance.authenticated || false);
        if (keycloakInstance.authenticated) {
          setUsername(keycloakInstance.tokenParsed?.preferred_username || null);
          setToken(keycloakInstance.token || null);
          setRoles(keycloakInstance.realmAccess?.roles || []);
        }
        setLoading(false);
        return;
      }

      try {
        keycloakInitialized = true;
        const authenticated = await keycloakInstance.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });

        setIsAuthenticated(authenticated);
        if (authenticated) {
          setUsername(keycloakInstance.tokenParsed?.preferred_username || null);
          setToken(keycloakInstance.token || null);
          setRoles(keycloakInstance.realmAccess?.roles || []);
        }
      } catch (e) {
        console.error('Keycloak init failed', e);
        keycloakInitialized = false;
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => keycloakInstance?.login();
  const logout = () => keycloakInstance?.logout({ redirectUri: 'http://localhost:3000' });
  const register = () => keycloakInstance?.register({ redirectUri: 'http://localhost:3000' });

  return { isAuthenticated, username, token, roles, login, logout, register, loading };
}
