import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { useQueryClient } from '@tanstack/react-query';

const ADMIN_SESSION_KEY = 'adminSession';

export function useAdminAuth() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(ADMIN_SESSION_KEY);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) {
      setIsLoading(false);
      setIsAdminAuthenticated(false);
      return;
    }
    if (!actor || isFetching) return;

    actor.isAdminLoggedIn().then((active) => {
      setIsAdminAuthenticated(active);
      if (!active) localStorage.removeItem(ADMIN_SESSION_KEY);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [actor, isFetching]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!actor) throw new Error('Actor not available');
    setError(null);
    try {
      const success = await actor.adminLogin(email, password);
      if (success) {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
        setIsAdminAuthenticated(true);
        queryClient.invalidateQueries();
      } else {
        setError('Invalid email or password.');
      }
      return success;
    } catch (e: any) {
      setError(e?.message || 'Login failed.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthenticated(false);
    queryClient.clear();
    window.location.href = '/admin/login';
  };

  return { isAdminAuthenticated, isLoading, error, login, logout };
}
