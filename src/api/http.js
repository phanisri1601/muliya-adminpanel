import { API_BASE_URL } from './config';

function buildUrl(path) {
  const p = String(path ?? '');
  if (/^https?:\/\//i.test(p)) return p;
  const cleanPath = p.startsWith('/') ? p : `/${p}`;
  return `${API_BASE_URL}${cleanPath}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const message =
      (body && typeof body === 'object' && (body.message || body.error)) ||
      (typeof body === 'string' && body) ||
      response.statusText ||
      'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export async function apiRequest(path, { method = 'GET', headers, body, token, ...rest } = {}) {
  const url = buildUrl(path);

  const resolvedToken = token ?? localStorage.getItem('auth_token') ?? undefined;
  const finalHeaders = {
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
    ...(headers ?? {}),
  };

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body == null ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    ...rest,
  });

  return parseResponse(response);
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => apiRequest(path, { ...options, method: 'DELETE' }),
};
