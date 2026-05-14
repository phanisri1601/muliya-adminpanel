const REMOTE_API_BASE = 'https://192.168.88.117:5000/api';

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
export const IMAGE_BASE_URL =
  import.meta.env.DEV
    ? '/image'
    : 'https://192.168.88.117:5000/image';