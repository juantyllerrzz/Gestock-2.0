import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Adjunta el token de todas las requests salientes, si existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gestock_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extrae un mensaje de error legible de cualquier respuesta fallida de Nest.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data!.message.join(', ');
    if (data?.message) return data.message;
  }
  return 'Ocurrio un error inesperado. Intenta de nuevo.';
}
