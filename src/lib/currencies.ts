import React, { createContext, useContext, useState } from 'react';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // exchange rate relative to 1 USD
  flag: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'USD', rate: 1.0, flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', name: 'INR', rate: 83.5, flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', name: 'EUR', rate: 0.92, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'GBP', rate: 0.79, flag: '🇬🇧' },
];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatAmount: (amountUSD: number, decimalPlaces?: number) => string;
  convertAmount: (amountUSD: number) => number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('smartlender_currency');
    if (saved === 'USD' || saved === 'INR' || saved === 'EUR' || saved === 'GBP') {
      return saved as CurrencyCode;
    }
    return 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('smartlender_currency', code);
  };

  const currentOption = CURRENCY_OPTIONS.find(o => o.code === currency) || CURRENCY_OPTIONS[0];

  const convertAmount = (amountUSD: number) => {
    return amountUSD * currentOption.rate;
  };

  const formatAmount = (amountUSD: number, decimalPlaces: number = 0) => {
    const converted = convertAmount(amountUSD);
    return `${currentOption.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })}`;
  };

  return React.createElement(
    CurrencyContext.Provider,
    { value: { currency, setCurrency, formatAmount, convertAmount, symbol: currentOption.symbol } },
    children
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
