/**
 * Agamagizh CRM Context
 * Manages active provider (Local vs Real Rails HTTP), dynamic account context,
 * health status, and strict clinical write-lock state.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CrmDataProvider } from '../services/crm/CrmDataProvider';
import { LocalCrmDataProvider } from '../services/crm/LocalCrmDataProvider';
import { HttpCrmDataProvider } from '../services/crm/HttpCrmDataProvider';
import { AccountSummary, UserProfile } from '../types/crm';

export interface CrmContextValue {
  provider: CrmDataProvider;
  mode: 'local' | 'real';
  setMode: (mode: 'local' | 'real') => void;
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  accountContext: {
    activeAccount: AccountSummary | null;
    availableAccounts: AccountSummary[];
    userProfile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    switchAccount: (accountId: number) => Promise<void>;
    refreshProfile: () => Promise<void>;
  };
  connection: {
    status: 'healthy' | 'unreachable' | 'degraded';
    latencyMs: number;
    isChecking: boolean;
    checkNow: () => Promise<void>;
  };
  clinicalWritesEnabled: boolean; // Strictly false (locked)
}

const CrmContext = createContext<CrmContextValue | null>(null);

const DEFAULT_DATA_MODE = ((import.meta as any).env?.VITE_DATA_MODE === 'real' ? 'real' : 'local') as 'local' | 'real';
const DEFAULT_BASE_URL = (import.meta as any).env?.VITE_CHATWOOT_BASE_URL || '';

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<'local' | 'real'>(() => {
    const saved = localStorage.getItem('agamagizh_crm_mode');
    return saved === 'real' || saved === 'local' ? saved : DEFAULT_DATA_MODE;
  });

  const [baseUrl, setBaseUrlState] = useState<string>(() => {
    return localStorage.getItem('agamagizh_crm_base_url') || DEFAULT_BASE_URL;
  });

  const localProvider = useMemo(() => new LocalCrmDataProvider(), []);
  const httpProvider = useMemo(() => new HttpCrmDataProvider(baseUrl), [baseUrl]);

  const activeProvider = mode === 'real' ? httpProvider : localProvider;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeAccount, setActiveAccount] = useState<AccountSummary | null>(null);
  const [availableAccounts, setAvailableAccounts] = useState<AccountSummary[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unreachable' | 'degraded'>('healthy');
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  const setMode = useCallback((newMode: 'local' | 'real') => {
    setModeState(newMode);
    localStorage.setItem('agamagizh_crm_mode', newMode);
  }, []);

  const setBaseUrl = useCallback((url: string) => {
    setBaseUrlState(url);
    localStorage.setItem('agamagizh_crm_base_url', url);
  }, []);

  const checkConnection = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const health = await activeProvider.checkHealth();
      setHealthStatus(health.status);
      setLatencyMs(health.latencyMs);
    } catch {
      setHealthStatus('unreachable');
      setLatencyMs(0);
    } finally {
      setIsCheckingHealth(false);
    }
  }, [activeProvider]);

  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const profile = await activeProvider.getProfile();
      setUserProfile(profile);
      const accounts = profile.accounts || [];
      setAvailableAccounts(accounts);
      const current = accounts.find(a => a.id === profile.account_id) || accounts[0] || null;
      setActiveAccount(current);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to fetch account profile');
      if (mode === 'real') {
        // Fallback gracefully to local mock accounts for display while indicating unreachable backend
        setHealthStatus('unreachable');
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [activeProvider, mode]);

  const switchAccount = useCallback(async (accountId: number) => {
    try {
      await activeProvider.switchAccount(accountId);
      const current = availableAccounts.find(a => a.id === accountId) || null;
      setActiveAccount(current);
      if (userProfile) {
        setUserProfile({ ...userProfile, account_id: accountId });
      }
    } catch (err: any) {
      setProfileError(err.message || 'Failed to switch account');
    }
  }, [activeProvider, availableAccounts, userProfile]);

  useEffect(() => {
    loadProfile();
    checkConnection();
  }, [loadProfile, checkConnection]);

  const value: CrmContextValue = useMemo(() => ({
    provider: activeProvider,
    mode,
    setMode,
    baseUrl,
    setBaseUrl,
    accountContext: {
      activeAccount,
      availableAccounts,
      userProfile,
      isLoading: isLoadingProfile,
      error: profileError,
      switchAccount,
      refreshProfile: loadProfile,
    },
    connection: {
      status: healthStatus,
      latencyMs,
      isChecking: isCheckingHealth,
      checkNow: checkConnection,
    },
    clinicalWritesEnabled: false, // CLINICAL WRITE-LOCK MANDATE
  }), [
    activeProvider,
    mode,
    setMode,
    baseUrl,
    setBaseUrl,
    activeAccount,
    availableAccounts,
    userProfile,
    isLoadingProfile,
    profileError,
    switchAccount,
    loadProfile,
    healthStatus,
    latencyMs,
    isCheckingHealth,
    checkConnection,
  ]);

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return ctx;
}
