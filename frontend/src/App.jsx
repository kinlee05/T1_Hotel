/**
 * src/App.jsx
 * Router chính — tích hợp AuthContext + Admin panel.
 * - Customer pages: từ T1_Hotel/frontend
 * - Admin pages: từ CM+ (đã hoàn thiện)
 */
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
import HomePage      from './pages/HomePage';
import AuthPage      from './pages/AuthPage';
import RoomsPage     from './pages/RoomPage';
import RoomDetailPage from './pages/RoomDetailPage';
import CartPage      from './pages/CartPage';
import CheckoutPage  from './pages/CheckoutPage';
import OrdersPage    from './pages/OrdersPage';
import ProfilePage   from './pages/ProfilePage';
import HistoryPage   from './pages/HistoryPage';
import AdminPage     from './pages/AdminPage';

// ── Map vai_tro → page để điều hướng sau khi login ───────────────────────────
const ROLE_PAGE = {
  admin:        'admin',
  le_tan:       'leitan',
  housekeeping: 'housekeeping',
  ke_toan:      'ketoan',
  it:           'it',
  khach_hang:   'home',
};

// ── Inner app (cần useAuth nên phải nằm trong AuthProvider) ──────────────────
function InnerApp() {
  const { user, logout, isLoading } = useAuth();

  const [page, setPage]               = useState('home');
  const [cart, setCart]               = useState([]);
  const [search, setSearch]           = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  const cartCount = cart.length;

  // Các trang cần đăng nhập (customer)
  const protectedPages = ['cart', 'checkout', 'orders', 'profile', 'history'];

  const nav = (p) => {
    if (protectedPages.includes(p) && !user) {
      setPage('login');
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setCart([]);
    setPage('home');
  };

  // Khi đang load token (kiểm tra auth), chờ
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C9A84C', fontSize: 18 }}>Đang tải...</div>
      </div>
    );
  }

  // ── Admin ──────────────────────────────────────────────────────────────────
  if (user?.vai_tro === 'admin' || page === 'admin') {
    // Nếu chưa đăng nhập và cố vào admin → về login
    if (!user) {
      return <AuthPage initialMode="login" setPage={(p) => {
        const u = JSON.parse(localStorage.getItem('user') || 'null');
        setPage(u ? (ROLE_PAGE[u.vai_tro] || 'home') : 'home');
      }} />;
    }
    return <AdminPage onLogout={handleLogout} />;
  }

  // ── Các role staff khác (nhóm làm sau) ────────────────────────────────────
  if (page === 'leitan')       return <ComingSoon role="Lễ Tân" onLogout={handleLogout} />;
  if (page === 'housekeeping') return <ComingSoon role="Housekeeping" onLogout={handleLogout} />;
  if (page === 'ketoan')       return <ComingSoon role="Kế Toán" onLogout={handleLogout} />;
  if (page === 'it')           return <ComingSoon role="IT" onLogout={handleLogout} />;

  const noNavFooter = ['login', 'register'];

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage setPage={nav} setSearch={setSearch} setSelectedRoom={setSelectedRoom} />;
      case 'rooms':
        return <RoomsPage setPage={nav} setSelectedRoom={setSelectedRoom} searchParams={search} />;
      case 'room-detail':
        return <RoomDetailPage room={selectedRoom} setPage={nav} cart={cart} setCart={setCart} />;
      case 'login':
      case 'register':
        return (
          <AuthPage
            initialMode={page}
            setPage={(p) => {
              // Sau login, redirect theo vai_tro
              const u = JSON.parse(localStorage.getItem('user') || 'null');
              if (u && ROLE_PAGE[u.vai_tro]) {
                setPage(ROLE_PAGE[u.vai_tro]);
              } else {
                setPage(p || 'home');
              }
            }}
          />
        );
      case 'cart':
        return <CartPage cart={cart} setCart={setCart} setPage={nav} />;
      case 'checkout':
        return <CheckoutPage cart={cart} setCart={setCart} setPage={nav} />;
      case 'orders':
        return <OrdersPage setPage={nav} />;
      case 'profile':
        return <ProfilePage />;
      case 'history':
        return <HistoryPage setPage={nav} />;
      default:
        return (
          <div style={{ padding: '120px 80px', textAlign: 'center', color: '#8A8070' }}>
            <h2 style={{ color: '#C9A84C', marginBottom: 16 }}>Trang đang phát triển</h2>
            <p>Nội dung trang <strong style={{ color: '#F5F0E8' }}>{page}</strong> sẽ sớm ra mắt.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column' }}>
      {!noNavFooter.includes(page) && (
        <Navbar
          page={page}
          setPage={nav}
          user={user}
          cartCount={cartCount}
          onLogout={handleLogout}
        />
      )}
      <div style={{ paddingTop: noNavFooter.includes(page) ? 0 : 68, flex: 1 }}>
        {renderPage()}
      </div>
      {!noNavFooter.includes(page) && <Footer setPage={nav} />}
    </div>
  );
}

// ── Placeholder cho các role staff chưa làm ──────────────────────────────────
function ComingSoon({ role, onLogout }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <h2 style={{ color: '#C9A84C', fontFamily: 'serif', fontSize: 32 }}>Trang {role}</h2>
      <p style={{ color: '#8A8070' }}>Đang phát triển — coming soon</p>
      <button
        onClick={onLogout}
        style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
