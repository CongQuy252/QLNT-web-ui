import axios from 'axios';

// Khởi tạo instance mặc định cho toàn project
export const http = axios.create({
  // eslint-disable-next-line no-constant-binary-expression
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token hết hạn hoặc không hợp lệ.');
      localStorage.removeItem('token');
    }

    return Promise.reject(error);
  },
);

if (import.meta.env.DEV) {
  http.interceptors.response.use(
    (res) => {
      console.debug('[HTTP SUCCESS]', res.config.url, res.status);
      return res;
    },
    (err) => {
      console.error('[HTTP ERROR]', err.config?.url, err.message);
      return Promise.reject(err);
    },
  );
}
