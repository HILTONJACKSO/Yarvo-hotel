/**
 * @bellacasa/shared
 * Shared types and utilities for Bella Casa HMS
 */

// API response envelope types
export interface ApiSuccessResponse<T> {
  data: T;
  meta?: PaginationMeta;
  requestId: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  details?: unknown;
  requestId: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Currency types
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'LRD' | string;

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  label: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', label: 'USD ($) — US Dollar', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', label: 'EUR (€) — Euro', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', label: 'GBP (£) — British Pound', decimals: 2 },
  { code: 'LRD', symbol: 'L$', name: 'Liberian Dollar', label: 'LRD (L$) — Liberian Dollar', decimals: 2 },
];

export function getCurrencySymbol(code?: string): string {
  if (!code) return '$';
  const found = SUPPORTED_CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  return found ? found.symbol : '$';
}

export interface Money {
  amount: string; // Use string to preserve decimal precision
  currency: CurrencyCode;
}

// Health check types
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
  database: {
    status: 'ok' | 'down';
    message: string;
  };
}
