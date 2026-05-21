import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import RoomsPage from "./pages/RoomPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import { DEMO_USER } from "./data/constants";

export default function App() {
  const [page, setPage]                 = useState("home");
  const [user, setUser]                 = useState(null);
  const [cart, setCart]                 = useState([]);
  const [search, setSearch]             = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  const cartCount = cart.length;

  const handleLogin = () => {
    setUser(DEMO_USER);
    setPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  const noNavPages = ["login", "register"];
  const showNav = !noNavPages.includes(page);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} setSearch={setSearch} setSelectedRoom={setSelectedRoom} />;
      case "rooms":
        return <RoomsPage setPage={setPage} setSelectedRoom={setSelectedRoom} />;
      case "room-detail":
        return <RoomDetailPage room={selectedRoom} setPage={setPage} />;
      case "login":
      case "register":
        return <AuthPage onLogin={handleLogin} setPage={setPage} />;
      default:
        return (
          <div style={{ padding: "120px 80px", textAlign: "center", color: "#8A8070" }}>
            <h2 style={{ color: "#C9A84C", marginBottom: 16 }}>Trang đang phát triển</h2>
            <p>Nội dung trang <strong style={{ color: "#F5F0E8" }}>{page}</strong> sẽ sớm ra mắt.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      {showNav && (
        <Navbar
          page={page}
          setPage={setPage}
          user={user}
          cartCount={cartCount}
          onLogout={handleLogout}
        />
      )}
      <div style={{ paddingTop: showNav ? 68 : 0 }}>
        {renderPage()}
      </div>
    </div>
  );
}