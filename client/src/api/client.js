import axios from "axios";

const vercelBaseURL = import.meta.env.VITE_VERCEL_API;
const renderBaseURL = import.meta.env.VITE_RENDER_API;

// Primary API (Vercel)
const api = axios.create({
  baseURL: vercelBaseURL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR → FALLBACK LOGIC
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Only fallback for network / 5xx errors
    if (!error.response || error.response.status >= 500) {
      console.warn("Vercel failed → Switching to Render");

      return axios({
        ...originalRequest,
        baseURL: renderBaseURL,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
