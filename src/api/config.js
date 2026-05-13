const REMOTE_API_BASE = 'https://muliya.ourapi.co.in/api';

/** In dev, default to Vite proxy (`/api` → muliya) to avoid browser CORS. Override with VITE_API_BASE_URL. */
function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).replace(/\/+$/, '');
  }
  if (import.meta.env.DEV) {
    return '/api';
  }
  return REMOTE_API_BASE;
}

export const API_BASE_URL = resolveApiBaseUrl();
export const IMAGE_BASE_URL = 'https://muliya.ourapi.co.in/image';