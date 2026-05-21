import { useState } from "react";
import { S, fmt } from "../styles/theme";
import { ROOMS } from "../data/constants";
import GoldBtn from "../components/shared/GoldBtn";
import Footer from "../components/Footer";

function StarRating({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= rating ? "#C9A84C" : "#3a3530", fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

export default function RoomsPage({ setPage, setSelectedRoom }) {
  const [filter, setFilter] = useState("all");

  const types = ["all", "Standard", "Family", "Deluxe", "Suite"];

  const filtered = filter === "all" ? ROOMS : ROOMS.filter(r => r.type === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8" }}>
      {/* Header */}
      <div style={{
        background: "#f5f0e8",
        padding: "48px 60px 32px",
        borderBottom: "1px solid #e0d8cc",
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 36,
          fontWeight: 700,
          color: "#1a1208",
          marginBottom: 28,
        }}>
          Explore &amp; Book Your Stay
        </h1>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "7px 20px",
                borderRadius: 20,
                border: filter === t ? "1.5px solid #C9A84C" : "1.5px solid #d0c8bc",
                background: filter === t ? "#C9A84C" : "#fff",
                color: filter === t ? "#fff" : "#5a5040",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {t === "all" ? "All Rooms" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div style={{ padding: "28px 60px 60px", display: "flex", flexDirection: "column", gap: 20 }}>
        {filtered.map((room) => (
          <RoomCard key={room.id} room={room} setPage={setPage} setSelectedRoom={setSelectedRoom} />
        ))}
      </div>

      <div style={{ background: "#050505" }}>
        <Footer />
      </div>
    </div>
  );
}

function RoomCard({ room, setPage, setSelectedRoom }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        border: hovered ? "1.5px solid #C9A84C" : "1.5px solid #e8e0d4",
        transition: "all 0.25s",
        boxShadow: hovered ? "0 8px 32px rgba(201,168,76,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={room.img}
          alt={room.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.4s",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
        />
        <div style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(10,8,6,0.72)",
          backdropFilter: "blur(4px)",
          color: "#C9A84C",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          padding: "4px 10px",
          borderRadius: 4,
          border: "1px solid rgba(201,168,76,0.4)",
        }}>
          {room.type}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {/* Title + stars */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#1a1208",
              margin: 0,
            }}>
              {room.name}
            </h2>
          </div>
          <div style={{ marginBottom: 12 }}>
            <StarRating rating={room.rating} />
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: "#6b5e50", lineHeight: 1.65, marginBottom: 16, maxWidth: 480 }}>
            {room.description}
          </p>

          {/* Highlights */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: 18 }}>
            {room.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5a4e40" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #ede6da",
          paddingTop: 16,
        }}>
          <div>
            <span style={{ fontSize: 13, color: "#9a8e80", textDecoration: "line-through", marginRight: 8 }}>
              ${Math.round(room.price * 1.2)}/night
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#1a1208" }}>
                ${room.price}
              </span>
              <span style={{ fontSize: 12, color: "#9a8e80" }}>per night</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setSelectedRoom(room); setPage("room-detail"); }}
              style={{
                padding: "9px 20px",
                background: "transparent",
                border: "1.5px solid #C9A84C",
                color: "#C9A84C",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              View
            </button>
            <button
              onClick={() => { setSelectedRoom(room); setPage("room-detail"); }}
              style={{
                padding: "9px 22px",
                background: "linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)",
                border: "none",
                color: "#1a0e00",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.04em",
              }}
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}