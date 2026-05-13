import { API_BASE_URL } from './config';

/** Turn API JSON/text errors into a readable string (avoids `Error: [object Object]`). */
function formatErrorMessage(body, status, statusText) {
  const fallback = statusText || `Request failed (${status})`;

  if (body == null || body === '') return fallback;
  if (typeof body === 'string') {
    const t = body.trim();
    return t ? t.slice(0, 600) : fallback;
  }
  if (typeof body !== 'object') return String(body);

  const pick = (val) => {
    if (val == null) return '';
    if (typeof val === 'string') return val.trim();
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return val.map((x) => pick(x)).filter(Boolean).join('; ').slice(0, 600);
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val).slice(0, 500);
      } catch {
        return '';
      }
    }
    return String(val);
  };

  const direct =
    pick(body.message) ||
    pick(body.error) ||
    pick(body.msg) ||
    pick(body.err) ||
    pick(body.description);
  if (direct) return direct.slice(0, 600);

  if (body.errors && typeof body.errors === 'object') {
    const nested = pick(body.errors);
    if (nested) return nested.slice(0, 600);
  }

  try {
    const s = JSON.stringify(body);
    if (s && s !== '{}') return s.slice(0, 600);
  } catch {
    /* ignore */
  }

  return fallback;
}

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
    if (response.status === 413) {
      const err = new Error(
        'Upload too large (413). Try smaller images, or ask the server admin to raise the body size limit.'
      );
      err.status = 413;
      err.body = body;
      throw err;
    }
    const message = formatErrorMessage(body, response.status, response.statusText);
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

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body == null ? undefined : body instanceof FormData ? body : JSON.stringify(body),
      ...rest,
    });
  } catch (e) {
    const err = new Error(
      e?.message === 'Failed to fetch'
        ? 'Network error (often CORS or offline). In local dev, use the Vite `/api` proxy; in production the API must allow your site origin.'
        : e?.message || 'Network request failed'
    );
    err.cause = e;
    throw err;
  }

  return parseResponse(response);
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => apiRequest(path, { ...options, method: 'DELETE' }),
};
