import { NextRequest } from 'next/server';

/**
 * Get the base URL from environment or request headers
 */
export function getBaseUrl(request?: NextRequest): string {
  // If NEXT_PUBLIC_DOMAIN is set, use it (highest priority)
  if (process.env.NEXT_PUBLIC_DOMAIN) {
    return process.env.NEXT_PUBLIC_DOMAIN;
  }

  // If we have a request object, get the URL from headers
  if (request) {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    
    if (host) {
      return `${protocol}://${host}`;
    }
  }

  // Fallback to localhost for development
  return 'http://localhost:3000';
}

/**
 * Format price from cents to dollars
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
}