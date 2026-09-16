/**
 * CRM Context Provider
 * Bridges application views with either the local in-memory provider or the real HTTP Rails provider.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CrmDataProvider } from '../services/crm/CrmDataProvider';
import { LocalCrmDataProvider } from '../services/crm/LocalCrmDataProvider';
import { HttpCrmDataProvider } from '../services/crm/HttpCrmDataProvider';
import { AccountSummary } from '../types/crm';

interface AccountContextState {
  activeAccount: AccountSummary | null;
  accounts: AccountSummary[];
  availableAccounts?: AccountSummary[];
  isLoading?: boolean;
  switchAccount: (accountId: number) => Promise<void>;
}

interface CrmConnectionState {
  isConnected: boolean;
  status: 'healthy' | 'degraded' | 'offline' | string;
  latencyMs: number;
  isChecking: boolean;
  checkNow: () => Promise<void>;
}

interface CrmContextValue {
  provider: CrmDataProvider;
  mode: 'local' | 'real';
  setMode: (mode: 'local' | 'real') => void;
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  connection: CrmConnectionState;
  clinicalWritesEnabled: boolean;
  accountContext: AccountContextState;
  isHealthy: boolean;
  healthLatency: number;
}

const localSingletonProvider = new LocalCrmDataProvider();
const httpSingletonProvider = new HttpCrmDataProvider();

const defaultAccount: AccountSummary = {
  id: 1,
  name: 'Agamagizh Care HQ (Chennai Main)',
  status: 'active',
  role: 'administrator',
  availability: 'online',
};

const defaultContextValue: CrmContextValue = {
  provider: localSingletonProvider,
  mode: 'local',
  setMode: () => {},
  baseUrl: 'http://localhost:3000',
  setBaseUrl: () => {},
  connection: {
    isConnected: true,
    status: 'healthy',
    latencyMs: 5,
    isChecking: false,
    checkNow: async () => {},
  },
  clinicalWritesEnabled: true,
  accountContext: {
    activeAccount: defaultAccount,
    accounts: [defaultAccount],
    availableAccounts: [defaultAccount],
    isLoading: false,
    switchAccount: async () => {},
  },
  isHealthy: true,
  healthLatency: 5,
};

const CrmContext = createContext<CrmContextValue>(defaultContextValue);

export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const envMode = ((import.meta as any).env?.VITE_DATA_MODE as string)?.toLowerCase();
  const initialMode: 'local' | 'real' = envMode === 'real' ? 'real' : 'local';
  const [mode, setMode] = useState<'local' | 'real'>(initialMode);
  const [baseUrl, setBaseUrl] = useState<string>('http://localhost:3000');
  const [activeAccount, setActiveAccount] = useState<AccountSummary | null>(defaultAccount);
  const [accounts, setAccounts] = useState<AccountSummary[]>([defaultAccount]);
  const [isHealthy, setIsHealthy] = useState<boolean>(true);
  const [healthLatency, setHealthLatency] = useState<number>(5);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeProvider = useMemo(() => {
    return mode === 'real' ? httpSingletonProvider : localSingletonProvider;
  }, [mode]);

  useEffect(() => {
    let mounted = true;
    activeProvider.getAccounts().then((list) => {
      if (mounted && list.length > 0) {
        setAccounts(list);
        if (!activeAccount || !list.find((a) => a.id === activeAccount.id)) {
          setActiveAccount(list[0]);
        }
      }
    }).catch(() => {});

    activeProvider.checkHealth().then((h) => {
      if (mounted) {
        setIsHealthy(h.status === 'healthy');
        setHealthLatency(h.latencyMs);
      }
    }).catch(() => {
      if (mounted) setIsHealthy(false);
    });

    return () => { mounted = false; };
  }, [activeProvider]);

  const checkNow = async () => {
    setIsChecking(true);
    try {
      const h = await activeProvider.checkHealth();
      setIsHealthy(h.status === 'healthy');
      setHealthLatency(h.latencyMs);
    } catch {
      setIsHealthy(false);
    } finally {
      setIsChecking(false);
    }
  };

  const switchAccount = async (accountId: number) => {
    await activeProvider.switchAccount(accountId);
    const target = accounts.find((a) => a.id === accountId);
    if (target) {
      setActiveAccount(target);
    }
  };

  const value: CrmContextValue = {
    provider: activeProvider,
    mode,
    setMode,
    baseUrl,
    setBaseUrl,
    connection: {
      isConnected: isHealthy,
      status: isHealthy ? 'healthy' : 'offline',
      latencyMs: healthLatency,
      isChecking,
      checkNow,
    },
    clinicalWritesEnabled: true,
    accountContext: {
      activeAccount,
      accounts,
      availableAccounts: accounts,
      isLoading,
      switchAccount,
    },
    isHealthy,
    healthLatency,
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = (): CrmContextValue => {
  return useContext(CrmContext);
};
