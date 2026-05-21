/**
 * src/context/AuthContext.jsx
 * Context quản lý trạng thái xác thực toàn app.
 * Cung cấp: user, token, login(), logout(), isLoading
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true khi đang kiểm tra token lúc app load

  // ── Khởi động: kiểm tra token đã lưu ──────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const saved = localStorage.getItem('user');

      if (token && saved) {
        try {
          setUser(JSON.parse(saved));
          // Verify token còn hợp lệ không
          const { data } = await api.get('/auth/me');
          // Cập nhật user mới nhất từ server
          const freshUser = {
            id:            data._id,
            ho_ten:        data.ho_ten,
            email:         data.email,
            vai_tro:       data.id_vaitro?.ten_vaitro,
            khach_hang_id: data.profile?._id || null,
          };
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch {
          // Token hết hạn → xóa sạch
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    init();

    // Lắng nghe event logout từ api interceptor (401)
    const handleForceLogout = () => {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, mat_khau) => {
    const { data } = await api.post('/auth/login', { email, mat_khau });

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    return data.user; // trả về để caller dùng (redirect theo role)
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Bỏ qua lỗi, vẫn logout phía client
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // ── Change password ────────────────────────────────────────────────────────
  const changePassword = useCallback(async (mat_khau_cu, mat_khau_moi) => {
    const { data } = await api.patch('/auth/change-password', { mat_khau_cu, mat_khau_moi });
    return data;
  }, []);

  const value = {
    user,
    isLoading,
    isLoggedIn:  !!user,
    isCustomer:  user?.vai_tro === 'khach_hang',
    login,
    register,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook tiện dụng
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
  return ctx;
}