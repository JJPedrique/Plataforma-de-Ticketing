import axiosClient from '../../../core/api/axiosClient';

export const PayMethodsService = {
  getAll: (params, config) => axiosClient.get('/PayMethods', { params, ...config }),
  getById: (id) => axiosClient.get(`/PayMethods/${id}`),
};

export const generarReferenciaPasarela = (prefijo = "TXN") => {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  // Se excluyen 0, O, I, 1 para evitar confusiones visuales
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);

  const sufijo = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("");
  return `${prefijo}-${fecha}-${sufijo}`;
};

export const generarReferenciaBancaria = (longitud = 12) => {
  const bytes = new Uint8Array(longitud);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (b) => b % 10).join("");
};

export const generarTxHashCrypto = (conPrefijo = true) => {
  const bytes = new Uint8Array(32); // 32 bytes = 64 caracteres hex
  crypto.getRandomValues(bytes);

  const hashHex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return conPrefijo ? `0x${hashHex}` : hashHex;
};

export const generarReferenciaEfectivo = (prefijo = "EFEC") => {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);

  const codigo = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("");
  return `${prefijo}-${fecha}-${codigo}`;
};

export const generarReferenciaPagoMovil = (longitud = 12) => {
  const bytes = new Uint8Array(longitud);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (b) => b % 10).join("");
};