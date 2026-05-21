/**
 * src/api.js
 * Axios instance dùng chung cho toàn bộ app.
 * - Tự gắn Authorization header từ localStorage
 * - Tự redirect về /login khi token hết hạn (401)
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: gắn token vào mọi request ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: xử lý lỗi tập trung ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token hết hạn hoặc không hợp lệ → xóa và về trang login
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Tránh redirect loop nếu đang ở trang login
      if (!window.location.pathname.includes('login')) {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }

    // 403 - không đủ quyền
    if (status === 403) {
      console.warn('Không có quyền truy cập tài nguyên này');
    }

    return Promise.reject(error);
  }
);

export default api;