import { BASE_URL, API_KEY } from '../constants/config';

/**
 * Wrapper fetch dasar. Semua endpoint di /src/api/*.js pakai ini
 * supaya header & error handling-nya konsisten di satu tempat.
 */
export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request gagal (${res.status})`;
    throw new Error(message);
  }

  return data;
}

/** Ambil array dari response, apapun bentuk pembungkusnya. */
export function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.result)) return data.result;
  return [];
}
