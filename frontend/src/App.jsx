/**
 * src/App.jsx
 * Router chính — tích hợp AuthContext.
 */
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar  from './components/Navbar';
import Footer  from './components/Footer';
import HomePage       from './pages/HomePage';
import AuthPage       from './pages/AuthPage';
import RoomsPage      from './pages/RoomPage';
import RoomDetailPage from './pages/RoomDetailPage';
import CartPage       from './pages/CartPage';
import CheckoutPage   from './pages/CheckoutPage';
import OrdersPage     from './pages/OrdersPage';
import ProfilePage    from './pages/ProfilePage';
import HistoryPage    from './pages/HistoryPage';

// ── Inner app (cần useAuth nên phải nằm trong AuthProvider) ──────────────────
function InnerApp() {
  const { user, logout } = useAuth();

  const [page, setPage]               = useState('home');
  const [cart, setCart]               = useState([]);
  const [search, setSearch]           = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  const cartCount = cart.length;

  // Các trang cần đăng nhập
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
        return <AuthPage initialMode={page} setPage={nav} />;
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

// ── Root export ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}