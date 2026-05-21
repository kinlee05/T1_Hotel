import { S } from "../styles/theme";
import GoldBtn from "./shared/GoldBtn";

export default function Navbar({ page, setPage, user, cartCount, onLogout }) {
  const links = [
    { key: "home",    label: "Trang chủ" },
    { key: "rooms",   label: "Phòng & Giá" },
    ...(user
      ? [
          { key: "cart",    label: `Giỏ hàng${cartCount > 0 ? ` (${cartCount})` : ""}` },
          { key: "orders",  label: "Đơn hàng" },
          { key: "profile", label: "Tài khoản" },
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
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${S.border}`,
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        gap: 24,
      }}
    >
      {/* Logo — bên trái */}
      <div
        onClick={() => setPage("home")}
        style={{ cursor: "pointer", flexShrink: 0 }}
      >
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          color: S.gold,
          letterSpacing: 3,
          lineHeight: 1,
        }}>
          T1
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 10,
          color: S.muted,
          letterSpacing: 5,
          textTransform: "uppercase",
        }}>
          Hotel
        </div>
      </div>

      {/* Nav links — ở giữa */}
      <div style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
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
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              if (page !== l.key) e.currentTarget.style.color = S.gold;
            }}
            onMouseLeave={e => {
              if (page !== l.key) e.currentTarget.style.color = S.muted;
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Auth buttons — bên phải */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {user ? (
          <>
            <span style={{ fontSize: 13, color: S.muted, marginRight: 4 }}>
              {user.name}
            </span>
            <GoldBtn onClick={onLogout} outline small>Đăng xuất</GoldBtn>
          </>
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