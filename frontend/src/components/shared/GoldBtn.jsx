import { S } from "../../styles/theme";

export default function GoldBtn({ onClick, children, style = {}, outline = false, small = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: outline
          ? "transparent"
          : "linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)",
        color: outline ? S.gold : "#0A0A0A",
        border: outline ? `1px solid ${S.gold}` : "none",
        padding: small ? "8px 18px" : "12px 28px",
        borderRadius: 4,
        fontWeight: 600,
        fontSize: small ? 12 : 14,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        transition: "all 0.2s",
        cursor: "pointer",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {children}
    </button>
  );
}