import { S } from "../styles/theme";

export default function Footer({ setPage }) {
  return (
    <div style={{ padding: "44px 80px", background: "#050505", borderTop: `1px solid ${S.border}`, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36 }}>
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: S.gold, letterSpacing: 3, marginBottom: 10 }}>T1 HOTEL</div>
        <p style={{ color: S.muted, fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>Khách sạn 5 sao hàng đầu, mang đến trải nghiệm lưu trú đẳng cấp tại trung tâm thành phố.</p>
      </div>
      {[
        ["Khám phá", ["Phòng & Suite", "Nhà hàng", "Spa", "Hội nghị"]],
        ["Hỗ trợ",   ["Đặt phòng", "Chính sách", "FAQ", "Liên hệ"]],
        ["Liên hệ",  ["📍 123 Nguyễn Huệ, Q.1", "📞 1800 9999", "✉ info@t1hotel.vn"]],
      ].map(([h, items]) => (
        <div key={h}>
          <h4 style={{ fontSize: 11, letterSpacing: 4, color: S.gold, textTransform: "uppercase", marginBottom: 16 }}>{h}</h4>
          {items.map(i => (
            <div key={i} style={{ fontSize: 13, color: S.muted, marginBottom: 8 }}>{i}</div>
          ))}
        </div>
      ))}
      <div style={{ gridColumn: "1/-1", borderTop: `1px solid ${S.border}`, paddingTop: 20, textAlign: "center", color: S.muted, fontSize: 12 }}>
        © 2025 T1 Hotel. All rights reserved.
      </div>
    </div>
  );
}