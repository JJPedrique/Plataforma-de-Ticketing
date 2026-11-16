import axios from 'axios';

const axiosClient = axios.create({
  // En Vite se usa import.meta.env.VITE_API_URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000, // Cancela la petición si tarda más de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta (Response): Manejo centralizado de errores
axiosClient.interceptors.response.use(
  (response) => response.data, // Opcional: devuelve directamente la data limpia
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expirado o inválido: limpiar sesión y redirigir
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('No tienes permisos para realizar esta acción.');
      } else if (status >= 500) {
        console.error('Error interno del servidor. Intenta más tarde.');
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor (revisa CORS o red).');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;