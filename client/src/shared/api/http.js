const envBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const API_BASE_URL = envBase;

const GENERIC_ERROR = 'No se pudo completar la solicitud. Inténtalo de nuevo.';

function sanitizeServerMessage(detail) {
  if (!detail) return '';
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (typeof d?.msg === 'string' ? d.msg : ''))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof detail !== 'string') return '';
  // Evitar exponer IDs, SQL, trazas o detalles internos de BD
  if (/(\bid\b|sql|traceback|psycopg|constraint|violat|duplicate key|syntax error|relation "|column ")/i.test(detail)) {
    return '';
  }
  if (/\d{2,}/.test(detail) && /(usuario|evento|lugar|m[eé]todo|orden|id)/i.test(detail)) {
    return '';
  }
  return detail;
}

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { return await res.json(); } catch { return null; }
  }
  const text = await res.text();
  return text ? { message: text } : null;
}

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const detail = data?.detail;
    const message = sanitizeServerMessage(detail) || sanitizeServerMessage(data?.message) || GENERIC_ERROR;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

export { API_BASE_URL };
