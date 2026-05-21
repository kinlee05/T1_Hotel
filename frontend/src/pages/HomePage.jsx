import { useState } from "react";
import { S, fmt, fmtD } from "../styles/theme";
import { ROOMS } from "../data/constants";
import GoldBtn from "../components/shared/GoldBtn";
import Stars from "../components/shared/Stars";
import { Hr } from "../components/shared/ui";

export default function HomePage({ setPage, setSearch }) {
  const [checkIn, setCheckIn]   = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests]     = useState(2);
  const [roomType, setRoomType] = useState("all");

  const inp = {
    background: "#1a1a1a",
    border: `1px solid rgba(201,168,76,0.3)`,
    color: S.text,
    padding: "10px 12px",
    borderRadius: 6,
    fontSize: 13,
    width: "100%",
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ height: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80) center/cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,1) 100%)" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 860, padding: "0 40px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 8, color: S.gold, textTransform: "uppercase", marginBottom: 18 }}>Chào mừng đến với</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 88, fontWeight: 700, lineHeight: 0.95, marginBottom: 22, background: `linear-gradient(135deg, ${S.gold}, ${S.goldLight}, ${S.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            GRAND<br />LUXURY
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "rgba(245,240,232,0.65)", marginBottom: 48, letterSpacing: 2, fontWeight: 300 }}>
            Nơi xa hoa hội tụ — Trải nghiệm đẳng cấp thế giới
          </p>

          {/* Search box */}
          <div style={{ background: "rgba(10,10,10,0.92)", border: `1px solid ${S.border}`, borderRadius: 8, padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 14, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Nhận phòng</label>
              <input type="date" value={checkIn} style={inp} min={new Date().toISOString().split("T")[0]} onChange={e => setCheckIn(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Trả phòng</label>
              <input type="date" value={checkOut} style={inp} min={checkIn} onChange={e => setCheckOut(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Số khách</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={inp}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} khách</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Loại phòng</label>
              <select value={roomType} onChange={e => setRoomType(e.target.value)} style={inp}>
                <option value="all">Tất cả</option>
                <option value="Standard">Standard</option>
                <option value="Superior">Superior</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <GoldBtn onClick={() => { setSearch({ checkIn, checkOut, guests, roomType }); setPage("rooms"); }} style={{ height: 42, whiteSpace: "nowrap" }}>
              Tìm phòng
            </GoldBtn>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ background: S.darkCard, borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}`, padding: "40px 80px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
        {[["250+","Phòng sang trọng"],["15+","Năm kinh nghiệm"],["50K+","Khách hài lòng"],["4.9★","Đánh giá trung bình"]].map(([v,l]) => (
          <div key={l}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, color: S.gold, fontWeight: 700 }}>{v}</div>
            <div style={{ fontSize: 12, color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── Featured rooms ── */}
      <div style={{ padding: "80px", background: S.darkBg }}>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: 6, color: S.gold, textTransform: "uppercase", marginBottom: 10 }}>Bộ sưu tập</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, textAlign: "center", marginBottom: 56, color: S.text }}>Phòng Nổi Bật</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {ROOMS.slice(0, 3).map(room => (
            <div
              key={room.id}
              style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = S.gold; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = S.border; }}
              onClick={() => setPage("rooms")}
            >
              <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                <img src={room.img} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(10,10,10,0.85)", border: `1px solid ${S.border}`, padding: "3px 10px", borderRadius: 4, fontSize: 11, color: S.gold }}>{room.type}</div>
              </div>
              <div style={{ padding: 22 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: S.text, marginBottom: 6 }}>{room.name}</h3>
                <Stars rating={room.rating} />
                <span style={{ fontSize: 12, color: S.muted, marginLeft: 6 }}>({room.reviews})</span>
                <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12, color: S.muted }}>
                  <span>🛏 {room.beds} giường</span>
                  <span>👤 {room.guests} khách</span>
                  <span>📐 {room.area}m²</span>
                </div>
                <Hr />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: S.muted, textDecoration: "line-through" }}>{fmt(room.originalPrice)}</div>
                    <div style={{ color: S.gold, fontWeight: 700, fontSize: 22 }}>
                      {fmt(room.price)}<span style={{ fontSize: 12, color: S.muted, fontWeight: 400 }}>/đêm</span>
                    </div>
                  </div>
                  <GoldBtn small>Xem ngay</GoldBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <GoldBtn outline onClick={() => setPage("rooms")}>Xem tất cả phòng</GoldBtn>
        </div>
      </div>

      {/* ── Services ── */}
      <div style={{ padding: "72px 80px", background: S.darkCard, borderTop: `1px solid ${S.border}` }}>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: 6, color: S.gold, textTransform: "uppercase", marginBottom: 10 }}>Tiện ích đẳng cấp</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, textAlign: "center", marginBottom: 48, color: S.text }}>Dịch Vụ 5 Sao</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {[["🍽","Nhà hàng","Ẩm thực Á-Âu tinh tế từ đầu bếp quốc tế"],["💆","Spa & Wellness","Thư giãn toàn diện với liệu trình cao cấp"],["🏊","Hồ bơi vô cực","Tầm nhìn panorama 360° toàn thành phố"],["🚗","Đưa đón VIP","Xe limousine hạng sang 24/7"]].map(([ic,t,d]) => (
            <div key={t} style={{ padding: 28, background: S.darkBg, border: `1px solid ${S.border}`, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 38, marginBottom: 14 }}>{ic}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: S.text, marginBottom: 8 }}>{t}</h3>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: "44px 80px", background: "#050505", borderTop: `1px solid ${S.border}`, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 36 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: S.gold, letterSpacing: 3, marginBottom: 10 }}>GRAND LUXURY</div>
          <p style={{ color: S.muted, fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>Khách sạn 5 sao hàng đầu, mang đến trải nghiệm lưu trú đẳng cấp tại trung tâm thành phố.</p>
        </div>
        {[
          ["Khám phá", ["Phòng & Suite","Nhà hàng","Spa","Hội nghị"]],
          ["Hỗ trợ",   ["Đặt phòng","Chính sách","FAQ","Liên hệ"]],
          ["Liên hệ",  ["📍 123 Nguyễn Huệ, Q.1","📞 1800 9999","✉ info@grand.vn"]],
        ].map(([h, items]) => (
          <div key={h}>
            <h4 style={{ fontSize: 11, letterSpacing: 4, color: S.gold, textTransform: "uppercase", marginBottom: 16 }}>{h}</h4>
            {items.map(i => <div key={i} style={{ fontSize: 13, color: S.muted, marginBottom: 8 }}>{i}</div>)}
          </div>
        ))}
        <div style={{ gridColumn: "1/-1", borderTop: `1px solid ${S.border}`, paddingTop: 20, textAlign: "center", color: S.muted, fontSize: 12 }}>
          © 2025 Grand Luxury Hotel. All rights reserved.
        </div>
      </div>
    </div>
  );
}