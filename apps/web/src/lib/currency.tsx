'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-provider';
import { db } from './db';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  label: string;
  country: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    label: 'USD ($) — US Dollar',
    country: 'United States',
    flag: '🇺🇸',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    label: 'EUR (€) — Euro',
    country: 'European Union',
    flag: '🇪🇺',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    label: 'GBP (£) — British Pound',
    country: 'United Kingdom',
    flag: '🇬🇧',
  },
  {
    code: 'LRD',
    symbol: 'L$',
    name: 'Liberian Dollar',
    label: 'LRD (L$) — Liberian Dollar',
    country: 'Liberia',
    flag: '🇱🇷',
  },
];

export function getCurrencySymbol(code?: string): string {
  if (!code) return '$';
  const match = SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return match ? match.symbol : '$';
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currencyCode: string = 'USD'
): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || '0'));
  const safeNum = isNaN(num) ? 0 : num;
  const symbol = getCurrencySymbol(currencyCode);
  const formattedNumber = safeNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formattedNumber}`;
}

interface CurrencyContextValue {
  currency: string;
  secondaryCurrency: string;
  currencySymbol: string;
  supportedCurrencies: CurrencyConfig[];
  format: (amount: number | string | null | undefined) => string;
  setCurrency: (code: string) => Promise<void>;
  setSecondaryCurrency: (code: string) => Promise<void>;
  getSymbol: (code?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  secondaryCurrency: 'LRD',
  currencySymbol: '$',
  supportedCurrencies: SUPPORTED_CURRENCIES,
  format: (amount) => formatCurrency(amount, 'USD'),
  setCurrency: async () => {},
  setSecondaryCurrency: async () => {},
  getSymbol: getCurrencySymbol,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [currency, setCurrencyState] = useState<string>('USD');
  const [secondaryCurrency, setSecondaryCurrencyState] = useState<string>('LRD');

  // Sync from user session on initial auth load
  useEffect(() => {
    if (user?.currencyPrimary) {
      setCurrencyState(user.currencyPrimary);
    }
    if (user?.currencySecondary) {
      setSecondaryCurrencyState(user.currencySecondary);
    }
  }, [user?.currencyPrimary, user?.currencySecondary]);

  // Sync from indexedDB / API property configuration
  useEffect(() => {
    let mounted = true;
    db.properties.toArray().then((props) => {
      if (!mounted) return;
      if (props.length > 0 && props[0].currencyPrimary) {
        setCurrencyState(props[0].currencyPrimary);
        if (props[0].currencySecondary) {
          setSecondaryCurrencyState(props[0].currencySecondary);
        }
      }
    });

    if (navigator.onLine) {
      fetch(`${API_URL}/api/v1/properties`, { credentials: 'include' })
        .then((res) => res.json())
        .then((resData) => {
          if (!mounted) return;
          const prop = resData.data || resData;
          if (prop && prop.currencyPrimary) {
            setCurrencyState(prop.currencyPrimary);
            if (prop.currencySecondary) {
              setSecondaryCurrencyState(prop.currencySecondary);
            }
          }
        })
        .catch(() => {});
    }

    const handleCustomChange = (e: any) => {
      if (e.detail?.currency) {
        setCurrencyState(e.detail.currency);
      }
      if (e.detail?.currencySecondary) {
        setSecondaryCurrencyState(e.detail.currencySecondary);
      }
    };

    window.addEventListener('yarvo-currency-changed', handleCustomChange);
    return () => {
      mounted = false;
      window.removeEventListener('yarvo-currency-changed', handleCustomChange);
    };
  }, []);

  const setCurrency = useCallback(
    async (newCode: string) => {
      const code = newCode.toUpperCase();
      setCurrencyState(code);

      // Notify window event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('yarvo-currency-changed', {
            detail: { currency: code, currencySecondary: secondaryCurrency },
          })
        );
      }

      // Update local IndexedDB
      try {
        const props = await db.properties.toArray();
        if (props.length > 0) {
          await db.properties.update(props[0].id, { currencyPrimary: code });
        }
      } catch (err) {
        console.warn('Error saving currency to IndexedDB:', err);
      }

      // Persist to backend API
      try {
        const props = await db.properties.toArray();
        const propId = user?.propertyId || (props.length > 0 ? props[0].id : null);
        if (propId) {
          await fetch(`${API_URL}/api/v1/properties/${propId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ currencyPrimary: code }),
          });
          if (refreshUser) {
            await refreshUser();
          }
        }
      } catch (err) {
        console.warn('Error saving currency to API:', err);
      }
    },
    [user?.propertyId, refreshUser, secondaryCurrency]
  );

  const setSecondaryCurrency = useCallback(
    async (newCode: string) => {
      const code = newCode.toUpperCase();
      setSecondaryCurrencyState(code);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('yarvo-currency-changed', {
            detail: { currency, currencySecondary: code },
          })
        );
      }

      try {
        const props = await db.properties.toArray();
        const propId = user?.propertyId || (props.length > 0 ? props[0].id : null);
        if (propId) {
          await fetch(`${API_URL}/api/v1/properties/${propId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ currencySecondary: code }),
          });
        }
      } catch (err) {
        console.warn('Error updating secondary currency:', err);
      }
    },
    [user?.propertyId, currency]
  );

  const format = useCallback(
    (amount: number | string | null | undefined) => {
      return formatCurrency(amount, currency);
    },
    [currency]
  );

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        secondaryCurrency,
        currencySymbol,
        supportedCurrencies: SUPPORTED_CURRENCIES,
        format,
        setCurrency,
        setSecondaryCurrency,
        getSymbol: getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
