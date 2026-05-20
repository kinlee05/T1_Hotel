import { S } from "../../styles/theme";

export default function Badge({ status }) {
  const map = {
    completed: { label: "Hoàn thành",    bg: "rgba(46,204,113,0.15)",  color: "#2ECC71" },
    confirmed: { label: "Đã xác nhận",  bg: "rgba(201,168,76,0.15)",  color: S.gold },
    pending:   { label: "Chờ xử lý",    bg: "rgba(243,156,18,0.15)",  color: S.warning },
    cancelled: { label: "Đã hủy",       bg: "rgba(231,76,60,0.15)",   color: S.danger },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {s.label}
    </span>
  );
}