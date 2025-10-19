/**
 * API utility for making authenticated requests
 */

let authToken: string | null = null;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/v0`
  : 'http://soul_backend.railway.internal/v0';
// export const API_BASE_URL = 'http://localhost:3001/v0';
export function setAuthToken (token: string | null) {
  authToken = token;
  if (token) {
    console.log('✅ [Auth Debug] Token stored in memory:', {
      tokenPreview: `${token.substring(0, 20)}...`,
      tokenLength: token.length,
    });
  } else {
    console.log('🔓 [Auth Debug] Token cleared from memory');
  }
}

export function getAuthToken (): string | null {
  return authToken;
}

export async function authenticatedFetch (url: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Add Bearer token if available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
    console.log('🔐 [Auth Debug] Token added to request:', {
      url,
      method: options.method || 'GET',
      tokenPreview: `${authToken.substring(0, 20)}...`,
      hasAuthHeader: !!headers['Authorization'],
    });
  } else {
    console.warn('⚠️ [Auth Debug] No token available for request:', {
      url,
      method: options.method || 'GET',
    });
  }

  // Log complete headers being sent (for debugging)
  console.log('📤 [Auth Debug] Request headers:', headers);

  return fetch(url, {
    ...options,
    headers,
  });
}
