const envBase = (import.meta.env?.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const API_BASE_URL = envBase;

const GENERIC_ERROR = 'No se pudo completar la solicitud. Inténtalo de nuevo.';

function sanitizeServerMessage(detail) {
  if (Array.isArray(detail)) {
    return detail.map(sanitizeServerMessage).filter(Boolean).join(', ');
  }

  let message = '';
  if (typeof detail === 'string') {
    message = detail;
  } else if (detail && typeof detail === 'object' && typeof detail.msg === 'string') {
    // Pydantic 422 puede devolver { type, loc, msg, input, ctx } o una lista de esos objetos.
    message = detail.msg;
  }
  if (!message) return '';

  // Evitar exponer IDs, SQL, trazas o detalles internos de BD
  if (/(\bid\b|sql|traceback|psycopg|constraint|violat|duplicate key|syntax error|relation "|column ")/i.test(message)) {
    return '';
  }
  if (/\d{2,}/.test(message) && /(usuario|evento|lugar|m[eé]todo|orden|id)/i.test(message)) {
    return '';
  }
  return message;
}

/** Convierte errores de axios/fetch a texto seguro para mostrar en la UI. */
export function getErrorMessage(error, fallback = GENERIC_ERROR) {
  return (
    sanitizeServerMessage(error?.response?.data?.detail) ||
    sanitizeServerMessage(error?.response?.data?.message) ||
    (typeof error?.message === 'string' ? error.message : '') ||
    fallback
  );
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
    const error = new Error(getErrorMessage({ response: { data } }, GENERIC_ERROR));
    error.status = res.status;
    throw error;
  }

  return data;
}

export { API_BASE_URL };
