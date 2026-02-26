import { useState, useEffect } from 'react';
import { useActor } from './useActor';

const ADMIN_SESSION_KEY = 'gs_admin_session';

export function useAdminAuth() {
  const { actor } = useActor();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (stored === 'true' && actor) {
        try {
          const loggedIn = await actor.isAdminLoggedIn();
          setIsAdminAuthenticated(loggedIn);
        } catch {
          setIsAdminAuthenticated(false);
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      }
      setIsLoading(false);
    };
    if (actor) checkSession();
  }, [actor]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!actor) return false;
    setError(null);
    try {
      const success = await actor.adminLogin(email, password);
      if (success) {
        setIsAdminAuthenticated(true);
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } else {
        setError('Invalid email or password');
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return { isAdminAuthenticated, isLoading, error, login, logout };
}
