import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { useQueryClient } from '@tanstack/react-query';
import type { SellerPublic } from '../backend';

const SELLER_SESSION_KEY = 'sellerSession';

export interface SellerSession {
  sellerId: string;
  passwordHash: string;
  verificationStatus: string;
}

export function useSellerAuth() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(SELLER_SESSION_KEY);
  });
  const [seller, setSeller] = useState<SellerPublic | null>(null);
  const [session, setSession] = useState<SellerSession | null>(() => {
    const s = localStorage.getItem(SELLER_SESSION_KEY);
    return s ? JSON.parse(s) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem(SELLER_SESSION_KEY);
    if (!sessionStr) {
      setIsLoading(false);
      setIsSellerAuthenticated(false);
      return;
    }
    if (!actor || isFetching) return;

    const sess: SellerSession = JSON.parse(sessionStr);
    actor.getSellerById(sess.sellerId).then((sellerData) => {
      if (sellerData) {
        setSeller(sellerData);
        setSession({ ...sess, verificationStatus: sellerData.verificationStatus });
        setIsSellerAuthenticated(true);
      } else {
        localStorage.removeItem(SELLER_SESSION_KEY);
        setIsSellerAuthenticated(false);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [actor, isFetching]);

  const login = async (email: string, password: string): Promise<{ success: boolean; verificationStatus?: string }> => {
    if (!actor) throw new Error('Actor not available');
    setError(null);
    try {
      const passwordHash = await hashPassword(password);
      const success = await actor.sellerLogin(email, passwordHash);
      if (success) {
        const sellerData = await actor.getSellerById(email);
        if (sellerData) {
          const sess: SellerSession = {
            sellerId: email,
            passwordHash,
            verificationStatus: sellerData.verificationStatus,
          };
          localStorage.setItem(SELLER_SESSION_KEY, JSON.stringify(sess));
          setSeller(sellerData);
          setSession(sess);
          setIsSellerAuthenticated(true);
          return { success: true, verificationStatus: sellerData.verificationStatus };
        }
      }
      return { success: false };
    } catch (e: any) {
      const msg = e?.message || 'Login failed.';
      const cleanMsg = msg.replace(/.*trap: /, '').replace(/\n.*/, '');
      setError(cleanMsg);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem(SELLER_SESSION_KEY);
    setIsSellerAuthenticated(false);
    setSeller(null);
    setSession(null);
    queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
    queryClient.invalidateQueries({ queryKey: ['sellerOrders'] });
    window.location.href = '/seller/login';
  };

  return { isSellerAuthenticated, seller, session, isLoading, error, setError, login, logout };
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
