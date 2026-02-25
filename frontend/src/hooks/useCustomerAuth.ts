import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { useQueryClient } from '@tanstack/react-query';
import type { Customer } from '../backend';

const CUSTOMER_SESSION_KEY = 'customerSession';

export function useCustomerAuth() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem(CUSTOMER_SESSION_KEY);
    if (!sessionStr) {
      setIsLoading(false);
      return;
    }
    if (!actor || isFetching) return;

    const customerId = BigInt(JSON.parse(sessionStr).customerId);
    actor.isCustomerLoggedIn(customerId).then(async (active) => {
      if (active) {
        const profile = await actor.getCustomerById(customerId);
        setCustomer(profile);
        setIsCustomerAuthenticated(true);
      } else {
        localStorage.removeItem(CUSTOMER_SESSION_KEY);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [actor, isFetching]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!actor) throw new Error('Actor not available');
    setError(null);
    try {
      const customerId = await actor.customerLogin(email, password);
      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify({ customerId: customerId.toString() }));
      const profile = await actor.getCustomerById(customerId);
      setCustomer(profile);
      setIsCustomerAuthenticated(true);
      return true;
    } catch (e: any) {
      const msg = e?.message || 'Login failed.';
      setError(msg.includes('trap') ? 'Invalid email or password.' : msg);
      return false;
    }
  };

  const register = async (name: string, phone: string, email: string, password: string): Promise<boolean> => {
    if (!actor) throw new Error('Actor not available');
    setError(null);
    try {
      const customerId = await actor.customerRegister(name, phone, email, password);
      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify({ customerId: customerId.toString() }));
      const profile = await actor.getCustomerById(customerId);
      setCustomer(profile);
      setIsCustomerAuthenticated(true);
      return true;
    } catch (e: any) {
      const msg = e?.message || 'Registration failed.';
      setError(msg.includes('already exists') ? 'An account with this email already exists.' : msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
    setIsCustomerAuthenticated(false);
    setCustomer(null);
    queryClient.clear();
    window.location.href = '/';
  };

  return { isCustomerAuthenticated, customer, isLoading, error, setError, login, register, logout };
}
