import { useState } from "react";
import { S, fmt, calcNights } from "../styles/theme";
import GoldBtn from "../components/shared/GoldBtn";
import Footer from "../components/Footer";

function StarRating({ rating, size = 16 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= rating ? "#C9A84C" : "#3a3530", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

const AMENITY_ICONS = {
  "Wi-Fi": "📶",
  "Mini Bar": "🍸",
  "Smart TV": "📺",
  "Air Conditioning": "❄️",
  "Jacuzzi": "🛁",
  "Kitchen": "🍳",
  "Butler": "🤵",
  "Sauna": "🧖",
  "Lounge": "🛋️",
  "Kids Area": "🧸",
  "Premium Toiletries": "🧴",
};

export default function RoomDetailPage({ room, setPage }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!room) {
    return (
      <div style={{ padding: "120px 80px", textAlign: "center", color: "#8A8070" }}>
        <p>Không tìm thấy phòng.</p>
        <GoldBtn onClick={() => setPage("rooms")} style={{ marginTop: 20 }}>Quay lại</GoldBtn>
      </div>
    );
  }

  const nights = calcNights(checkIn, checkOut);
  const total = room.price * nights;

  // Extra images (reuse same image slightly varied)
  const images = [room.img, room.img.replace("w=800", "w=801"), room.img.replace("w=800", "w=802")];

  const inp = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #d0c8bc",
    borderRadius: 8,
    fontSize: 14,
    background: "#fff",
    color: "#1a1208",
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "20px 60px", borderBottom: "1px solid #e0d8cc", background: "#f5f0e8", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9a8e80" }}>
        <span style={{ cursor: "pointer", color: "#C9A84C" }} onClick={() => setPage("home")}>Home</span>
        <span>›</span>
        <span style={{ cursor: "pointer", color: "#C9A84C" }} onClick={() => setPage("rooms")}>Rooms</span>
        <span>›</span>
        <span style={{ color: "#1a1208" }}>{room.name}</span>
      </div>

      <div style={{ padding: "36px 60px 60px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, maxWidth: 1400, margin: "0 auto" }}>
        {/* LEFT */}
        <div>
          {/* Main image */}
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, height: 460, position: "relative" }}>
            <img
              src={images[activeImg]}
              alt={room.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "rgba(10,8,6,0.72)",
              backdropFilter: "blur(4px)",
              color: "#C9A84C",
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: 4,
              border: "1px solid rgba(201,168,76,0.4)",
            }}>
              {room.type}
            </div>
          </div>

          {/* Thumbnail row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: 90,
                  height: 62,
                  borderRadius: 6,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: activeImg === i ? "2px solid #C9A84C" : "2px solid transparent",
                  opacity: activeImg === i ? 1 : 0.6,
                  transition: "all 0.2s",
                }}
              >
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>

          {/* Title & rating */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1a1208", margin: 0 }}>
                {room.name}
              </h1>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1a1208" }}>
                ${room.price}<span style={{ fontSize: 14, fontWeight: 400, color: "#9a8e80" }}>/night</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StarRating rating={room.rating} />
              <span style={{ fontSize: 13, color: "#9a8e80" }}>({room.reviews} reviews)</span>
              <span style={{ fontSize: 12, color: "#9a8e80", marginLeft: 8 }}>📍 Floor {room.floor} · {room.view}</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#e0d8cc", margin: "20px 0" }} />

          {/* Description */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#1a1208", marginBottom: 10 }}>About this room</h3>
          <p style={{ fontSize: 14, color: "#6b5e50", lineHeight: 1.75, marginBottom: 24 }}>
            {room.description} This elegantly appointed room offers {room.area}m² of luxury space designed for your comfort and relaxation. Whether you're here for business or leisure, every detail has been carefully curated to ensure an exceptional stay.
          </p>

          {/* Room specs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            {[
              ["🛏", "Bed Type", room.bedType],
              ["👥", "Max Guests", `${room.guests} guests`],
              ["📐", "Room Size", `${room.area}m²`],
              ["🏢", "Floor", `Floor ${room.floor}`],
            ].map(([icon, label, val]) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 11, color: "#9a8e80", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1208" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#1a1208", marginBottom: 14 }}>Amenities</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
            {room.amenities.map((a) => (
              <div key={a} style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #e0d8cc", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#3a2e20" }}>
                <span>{AMENITY_ICONS[a] || "✓"}</span>
                <span>{a}</span>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: "#1a1208", marginBottom: 14 }}>Room Highlights</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px" }}>
            {room.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5a4e40", padding: "6px 0", borderBottom: "1px solid #ede6da" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Booking widget */}
        <div style={{ position: "sticky", top: 88, height: "fit-content" }}>
          <div style={{ background: "#fff", border: "1.5px solid #e0d8cc", borderRadius: 12, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#1a1208", marginBottom: 20 }}>Reserve Your Stay</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: "#9a8e80", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Check-in</label>
                <input type="date" value={checkIn} min={new Date().toISOString().split("T")[0]} onChange={e => setCheckIn(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#9a8e80", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Check-out</label>
                <input type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#9a8e80", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Guests</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={inp}>
                  {Array.from({ length: room.guests }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ height: 1, background: "#e0d8cc", margin: "20px 0" }} />

            {/* Price breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b5e50" }}>
                <span>${room.price} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span>${total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b5e50" }}>
                <span>Taxes & fees (10%)</span>
                <span>${Math.round(total * 0.1)}</span>
              </div>
              <div style={{ height: 1, background: "#e0d8cc" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#1a1208", fontSize: 16 }}>
                <span>Total</span>
                <span>${Math.round(total * 1.1)}</span>
              </div>
            </div>

            <button
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)",
                border: "none",
                color: "#1a0e00",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              Book Now
            </button>
            <button
              onClick={() => setPage("rooms")}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                border: "1.5px solid #C9A84C",
                color: "#C9A84C",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Back to Rooms
            </button>

            <p style={{ fontSize: 11, color: "#9a8e80", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
              Free cancellation up to 48 hours before check-in
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "#050505" }}>
        <Footer />
      </div>
    </div>
  );
}