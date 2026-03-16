import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('vorce-auth');

  if (storedAuth) {
    const parsed = JSON.parse(storedAuth);

    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

export default api;
