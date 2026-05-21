/**
 * src/pages/CartPage.jsx
 * Giỏ hàng — hiển thị các phòng đã chọn, chỉnh sửa và thanh toán.
 */
import { useState } from "react";
import { S, fmt, calcNights } from "../styles/theme";
import GoldBtn from "../components/shared/GoldBtn";
import { SERVICES, PROMO_CODES } from "../data/constants";

export default function CartPage({ cart, setCart, setPage }) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const removeItem = (idx) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const toggleService = (itemIdx, serviceId) => {
    setCart(
      cart.map((item, i) => {
        if (i !== itemIdx) return item;
        const services = item.services || [];
        const has = services.includes(serviceId);
        return {
          ...item,
          services: has
            ? services.filter((s) => s !== serviceId)
            : [...services, serviceId],
        };
      })
    );
  };

  const applyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const pct = PROMO_CODES[promoCode.toUpperCase()];
    if (pct) {
      setDiscount(pct);
      setPromoSuccess(`Áp dụng thành công! Giảm ${pct}%`);
    } else {
      setPromoError("Mã không hợp lệ hoặc đã hết hạn");
    }
  };

  const calcItemTotal = (item) => {
    const nights = calcNights(item.checkIn, item.checkOut);
    const roomCost = (item.price || item.gia_moi_dem || 0) * nights;
    const svcCost = (item.services || []).reduce((sum, sid) => {
      const svc = SERVICES.find((s) => s.id === sid);
      return sum + (svc ? svc.price : 0);
    }, 0);
    return { nights, roomCost, svcCost, total: roomCost + svcCost };
  };

  const subtotal = cart.reduce((s, item) => s + calcItemTotal(item).total, 0);
  const discountAmt = Math.round(subtotal * discount / 100);
  const grandTotal = subtotal - discountAmt;

  const inp = {
    background: "#1a1a1a",
    border: `1px solid rgba(201,168,76,0.3)`,
    color: S.text,
    padding: "10px 14px",
    borderRadius: 6,
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontSize: 64 }}>🛒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: S.gold, fontSize: 28 }}>Giỏ hàng trống</h2>
        <p style={{ color: S.muted }}>Bạn chưa chọn phòng nào.</p>
        <GoldBtn onClick={() => setPage("rooms")}>Khám phá phòng</GoldBtn>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: S.darkBg, padding: "40px 60px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: S.text, marginBottom: 32 }}>
        Giỏ hàng của bạn
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
        {/* LEFT — Cart items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {cart.map((item, idx) => {
            const { nights, roomCost, svcCost, total } = calcItemTotal(item);
            const name = item.name || `Phòng ${item.so_phong}`;
            const img = item.img || item.hinh_anh || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80";
            const price = item.price || item.gia_moi_dem || 0;

            return (
              <div key={idx} style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 0 }}>
                  <img src={img} alt={name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: S.text, margin: 0 }}>{name}</h3>
                        <p style={{ color: S.muted, fontSize: 12, marginTop: 4 }}>
                          {item.type || item.loai_phong} · Tầng {item.floor || item.tang}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        style={{ background: "transparent", border: "none", color: S.danger, cursor: "pointer", fontSize: 18 }}
                        title="Xóa"
                      >✕</button>
                    </div>

                    <div style={{ display: "flex", gap: 20, fontSize: 12, color: S.muted, marginBottom: 12 }}>
                      <span>📅 {item.checkIn || "—"} → {item.checkOut || "—"}</span>
                      <span>🌙 {nights} đêm</span>
                      <span>💵 ${price}/đêm</span>
                    </div>

                    {/* Services */}
                    <div style={{ marginTop: 8 }}>
                      <p style={{ fontSize: 11, color: S.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Dịch vụ thêm</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {SERVICES.map((svc) => {
                          const selected = (item.services || []).includes(svc.id);
                          return (
                            <button
                              key={svc.id}
                              onClick={() => toggleService(idx, svc.id)}
                              style={{
                                padding: "5px 10px",
                                borderRadius: 20,
                                border: selected ? `1px solid ${S.gold}` : `1px solid rgba(201,168,76,0.25)`,
                                background: selected ? "rgba(201,168,76,0.15)" : "transparent",
                                color: selected ? S.gold : S.muted,
                                fontSize: 11,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              {svc.icon} {svc.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ marginTop: 12, textAlign: "right", color: S.gold, fontWeight: 700, fontSize: 16 }}>
                      ${total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Summary */}
        <div style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: 28, position: "sticky", top: 88 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: S.text, marginBottom: 20 }}>Tóm tắt đơn hàng</h3>

          {cart.map((item, idx) => {
            const { nights, total } = calcItemTotal(item);
            const name = item.name || `Phòng ${item.so_phong}`;
            return (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: S.muted, marginBottom: 8 }}>
                <span>{name} ({nights}đêm)</span>
                <span>${total.toLocaleString()}</span>
              </div>
            );
          })}

          <div style={{ height: 1, background: S.border, margin: "16px 0" }} />

          {/* Promo */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Mã giảm giá
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã..."
                style={{ ...inp, flex: 1 }}
              />
              <button
                onClick={applyPromo}
                style={{ padding: "10px 14px", background: "rgba(201,168,76,0.15)", border: `1px solid ${S.gold}`, color: S.gold, borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
              >
                Áp dụng
              </button>
            </div>
            {promoError && <p style={{ color: S.danger, fontSize: 12, marginTop: 6 }}>{promoError}</p>}
            {promoSuccess && <p style={{ color: S.success, fontSize: 12, marginTop: 6 }}>{promoSuccess}</p>}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: S.muted, marginBottom: 8 }}>
            <span>Tạm tính</span><span>${subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: S.success, marginBottom: 8 }}>
              <span>Giảm giá ({discount}%)</span><span>-${discountAmt.toLocaleString()}</span>
            </div>
          )}

          <div style={{ height: 1, background: S.border, margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: S.text, fontSize: 18, marginBottom: 20 }}>
            <span>Tổng cộng</span><span style={{ color: S.gold }}>${grandTotal.toLocaleString()}</span>
          </div>

          <GoldBtn style={{ width: "100%" }} onClick={() => setPage("checkout")}>
            Tiến hành thanh toán
          </GoldBtn>
          <GoldBtn outline style={{ width: "100%", marginTop: 10 }} onClick={() => setPage("rooms")}>
            Tiếp tục chọn phòng
          </GoldBtn>
        </div>
      </div>
    </div>
  );
}