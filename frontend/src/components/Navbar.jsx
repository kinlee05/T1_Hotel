import { S } from "../styles/theme";
import GoldBtn from "./shared/GoldBtn";

export default function Navbar({ page, setPage, user, cartCount, onLogout }) {
  const links = [
    { key: "home",   label: "Trang chủ" },
    { key: "rooms",  label: "Phòng & Giá" },
    ...(user
      ? [
          { key: "cart",    label: `Giỏ hàng${cartCount > 0 ? ` (${cartCount})` : ""}` },
          { key: "orders",  label: "Đơn hàng" },
          { key: "profile", label: "Tài khoản" },
          { key: "history", label: "Lịch sử" },
        ]
      : []),
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: "rgba(10,10,10,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${S.border}`,
        padding: "0 40px",
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <div onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: S.gold, letterSpacing: 3, lineHeight: 1 }}>GRAND</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, color: S.muted, letterSpacing: 5, textTransform: "uppercase" }}>Luxury Hotel</div>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {links.map((l) => (
          <button
            key={l.key}
            onClick={() => setPage(l.key)}
            style={{
              background: page === l.key ? "rgba(201,168,76,0.1)" : "transparent",
              color: page === l.key ? S.gold : S.muted,
              border: page === l.key ? `1px solid rgba(201,168,76,0.4)` : "1px solid transparent",
              padding: "7px 14px",
              borderRadius: 4,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {l.label}
          </button>
        ))}

        {user ? (
          <GoldBtn onClick={onLogout} outline small>Đăng xuất</GoldBtn>
        ) : (
          <>
            <GoldBtn onClick={() => setPage("login")} outline small>Đăng nhập</GoldBtn>
            <GoldBtn onClick={() => setPage("register")} small>Đăng ký</GoldBtn>
          </>
        )}
      </div>
    </nav>
  );
}