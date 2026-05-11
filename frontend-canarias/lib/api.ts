import axios from "axios";

/*
  Instancia central de Axios para todo el proyecto.
  Todos los services la importan desde acá.
  NUNCA crear una instancia nueva en cada componente.

  Maneja automáticamente:
  - Base URL del backend
  - Adjuntar el token JWT en cada request
  - Refrescar el token cuando expira (401)
  - Redirigir al login si el refresh también falla
*/

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 segundos — importante para conexiones lentas del cobrador
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
// Se ejecuta ANTES de cada request.
// Adjunta el access token del localStorage al header Authorization.

api.interceptors.request.use(
  (config) => {
    // Solo en el browser (no en SSR)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
// Se ejecuta DESPUÉS de cada response.
// Si el backend devuelve 401 (token expirado), intenta refrescarlo.

let isRefreshing = false;
// Cola de requests que fallaron mientras se estaba refrescando el token.
// Los reintentamos todos una vez que el nuevo token esté listo.
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  // Si la response es exitosa, la devuelve tal cual
  (response) => response,

  // Si hay error...
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no es un reintento (evita loop infinito)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Ya hay un refresh en curso — ponemos este request en la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Pedimos un nuevo access token al backend
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Actualizamos el header para el request fallido original
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Procesamos todos los requests que estaban esperando
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // El refresh también falló — sesión expirada, ir al login
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
