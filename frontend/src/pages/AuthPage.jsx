/**
 * src/pages/AuthPage.jsx
 * Đăng nhập + Đăng ký — kết nối API thật.
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ initialMode = 'login', setPage }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Form state
  const [form, setForm] = useState({
    ho_ten: '', email: '', mat_khau: '', confirm: '',
    sdt: '', ngay_sinh: '', gioi_tinh: '',
  });
  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const inputStyle = {
    width: '100%', padding: '15px 18px',
    border: '1px solid #d1d5db', borderRadius: 12,
    fontSize: 15, outline: 'none', marginTop: 8, background: '#fff',color: '#111',
    fontFamily: 'inherit',
  };
  const btnStyle = {
    width: '100%', padding: '15px',
    background: loading ? '#a08030' : '#c8a97e',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: 10, transition: '0.3s', fontFamily: 'inherit',
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.mat_khau) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    if (!isLogin && form.mat_khau !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!isLogin && !form.ho_ten) {
      setError('Vui lòng nhập họ tên');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const loggedUser = await login(form.email, form.mat_khau);
        // Redirect theo vai_tro
        const rolePageMap = {
          admin: 'admin', le_tan: 'leitan',
          housekeeping: 'housekeeping', ke_toan: 'ketoan',
          it: 'it', khach_hang: 'home',
        };
        setPage(rolePageMap[loggedUser?.vai_tro] || 'home');
        return;
      } else {
        await register({
          ho_ten:    form.ho_ten,
          email:     form.email,
          mat_khau:  form.mat_khau,
          sdt:       form.sdt,
          ngay_sinh: form.ngay_sinh || undefined,
          gioi_tinh: form.gioi_tinh || undefined,
        });
      }
      setPage('home');
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%', overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '42% 58%', background: '#fff',
    }}>
      {/* LEFT */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          {/* Logo placeholder */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: '#C9A84C', letterSpacing: 4 }}>
              T1 HOTEL
            </div>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 700, marginBottom: 10, color: '#111', lineHeight: 1.1 }}>
            {isLogin ? 'Welcome back!' : 'Create account'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            {isLogin ? 'Enter your credentials to access your account' : 'Create your account to continue'}
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Họ tên (register only) */}
            {!isLogin && (
              <div>
                <label style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Họ tên *</label>
                <input type="text" value={form.ho_ten} onChange={up('ho_ten')} placeholder="Nguyễn Văn A" style={inputStyle} />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Email *</label>
              <input type="email" value={form.email} onChange={up('email')} placeholder="email@example.com" style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>

            {/* SĐT (register only) */}
            {!isLogin && (
              <div>
                <label style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Số điện thoại</label>
                <input type="tel" value={form.sdt} onChange={up('sdt')} placeholder="0901234567" style={inputStyle} />
              </div>
            )}

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Mật khẩu *</label>
                {isLogin && <span style={{ fontSize: 13, color: '#2563eb', cursor: 'pointer' }}>Quên mật khẩu?</span>}
              </div>
              <input type="password" value={form.mat_khau} onChange={up('mat_khau')} placeholder="••••••••" style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>

            {/* Confirm password (register only) */}
            {!isLogin && (
              <div>
                <label style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Xác nhận mật khẩu *</label>
                <input type="password" value={form.confirm} onChange={up('confirm')} placeholder="••••••••" style={inputStyle} />
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
              {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </div>

          {/* Switch mode */}
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 15, color: '#6b7280' }}>
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <span onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ color: '#2563eb', marginLeft: 8, cursor: 'pointer', fontWeight: 600 }}>
              {isLogin ? 'Đăng ký' : 'Đăng nhập'}
            </span>
          </div>

          {/* Demo hint */}
          {isLogin && (
            <div style={{ marginTop: 24, padding: '12px 16px', background: '#f9fafb', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
              <strong>Demo:</strong> admin@hotel.com / 123456
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — ảnh nền */}
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100vh' }}>
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2200&auto=format&fit=crop"
          alt="hotel"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.12))' }} />
        <div style={{ position: 'absolute', bottom: 70, left: 70, color: '#fff', maxWidth: 560 }}>
          <p style={{ letterSpacing: 5, textTransform: 'uppercase', color: '#d4af37', fontSize: 12, marginBottom: 16 }}>Luxury Hotel</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 72, lineHeight: 1.05, marginBottom: 22 }}>
            Enjoy Your Dream Vacation
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.9 }}>
            Experience luxury, comfort and unforgettable moments at T1 Hotel with world-class service.
          </p>
        </div>
      </div>
    </div>
  );
}