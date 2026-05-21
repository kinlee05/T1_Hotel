/**
 * src/pages/CheckoutPage.jsx
 * Trang checkout — xác nhận thông tin và đặt phòng qua API.
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { S, calcNights } from "../styles/theme";
import GoldBtn from "../components/shared/GoldBtn";
import { SERVICES, PROMO_CODES } from "../data/constants";

export default function CheckoutPage({ cart, setCart, setPage }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [promoCode] = useState("");

  const [note, setNote] = useState("");

  const inp = {
    background: "#1a1a1a",
    border: `1px solid rgba(201,168,76,0.3)`,
    color: S.text,
    padding: "10px 14px",
    borderRadius: 6,
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
  };

  const calcItemTotal = (item) => {
    const nights = calcNights(item.checkIn, item.checkOut);
    const roomCost = (item.price || item.gia_moi_dem || 0) * nights;
    const svcCost = (item.services || []).reduce((sum, sid) => {
      const svc = SERVICES.find((s) => s.id === sid);
      return sum + (svc ? svc.price : 0);
    }, 0);
    return roomCost + svcCost;
  };

  const grandTotal = cart.reduce((s, item) => s + calcItemTotal(item), 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError("");
    try {
      // Đặt từng phòng trong giỏ hàng
      for (const item of cart) {
        const id_phong = item._id;
        if (!id_phong) continue; // skip demo items without real id

        const payload = {
          id_phong,
          ngay_checkin: item.checkIn,
          ngay_checkout: item.checkOut,
          so_khach: item.guests || 1,
          yeu_cau_dac_biet: note,
          dich_vu_ids: item.services || [],
          ma_giam_gia: promoCode || undefined,
        };

        const { data } = await api.post("/customer/dat-phong", payload);

        // Thanh toán ngay
        await api.post("/customer/thanh-toan", {
          id_datphong: data.data._id,
          phuong_thuc: payMethod,
        });
      }

      setCart([]);
      setPage("orders");
    } catch (err) {
      setError(err.response?.data?.message || "Đặt phòng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontSize: 64 }}>📋</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: S.gold }}>Không có gì để thanh toán</h2>
        <GoldBtn onClick={() => setPage("rooms")}>Chọn phòng</GoldBtn>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: S.darkBg, padding: "40px 60px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: S.text, marginBottom: 32 }}>
        Xác nhận & Thanh toán
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Customer info */}
          <div style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: S.gold, marginBottom: 16 }}>
              Thông tin khách hàng
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Họ tên</label>
                <input value={user?.ho_ten || ""} readOnly style={{ ...inp, opacity: 0.7 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
                <input value={user?.email || ""} readOnly style={{ ...inp, opacity: 0.7 }} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Yêu cầu đặc biệt</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Phòng tầng cao, không hút thuốc, v.v."
                style={{ ...inp, resize: "vertical" }}
              />
            </div>
          </div>

          {/* Payment method */}
          <div style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: S.gold, marginBottom: 16 }}>
              Phương thức thanh toán
            </h3>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { id: "card", label: "💳 Thẻ ngân hàng" },
                { id: "transfer", label: "🏦 Chuyển khoản" },
                { id: "cash", label: "💵 Tiền mặt" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: payMethod === m.id ? `1.5px solid ${S.gold}` : `1px solid rgba(201,168,76,0.25)`,
                    background: payMethod === m.id ? "rgba(201,168,76,0.12)" : "transparent",
                    color: payMethod === m.id ? S.gold : S.muted,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Booking summary */}
          <div style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: S.gold, marginBottom: 16 }}>
              Tóm tắt đặt phòng
            </h3>
            {cart.map((item, idx) => {
              const nights = calcNights(item.checkIn, item.checkOut);
              const name = item.name || `Phòng ${item.so_phong}`;
              const price = item.price || item.gia_moi_dem || 0;
              return (
                <div key={idx} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: idx < cart.length - 1 ? `1px solid ${S.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: S.text, fontWeight: 600 }}>{name}</span>
                    <span style={{ color: S.gold }}>${(price * nights).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 12, color: S.muted }}>
                    {item.checkIn} → {item.checkOut} · {nights} đêm · ${price}/đêm
                  </div>
                  {(item.services || []).length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(item.services || []).map((sid) => {
                        const svc = SERVICES.find((s) => s.id === sid);
                        return svc ? (
                          <span key={sid} style={{ fontSize: 11, background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`, color: S.gold, padding: "2px 8px", borderRadius: 20 }}>
                            {svc.icon} {svc.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Confirm */}
        <div style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: 28, position: "sticky", top: 88 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: S.text, marginBottom: 20 }}>Xác nhận đặt phòng</h3>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: S.muted, marginBottom: 8 }}>
            <span>Số phòng</span><span>{cart.length}</span>
          </div>
          <div style={{ height: 1, background: S.border, margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: S.text, fontSize: 20, marginBottom: 24 }}>
            <span>Tổng cộng</span>
            <span style={{ color: S.gold }}>${grandTotal.toLocaleString()}</span>
          </div>

          {error && (
            <div style={{ background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.4)", color: S.danger, padding: "10px 14px", borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <GoldBtn style={{ width: "100%" }} onClick={handleSubmit}>
            {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
          </GoldBtn>
          <GoldBtn outline style={{ width: "100%", marginTop: 10 }} onClick={() => setPage("cart")}>
            ← Quay lại giỏ hàng
          </GoldBtn>

          <p style={{ fontSize: 11, color: S.muted, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
            Miễn phí hủy trước 48h nhận phòng. Bằng cách xác nhận, bạn đồng ý với điều khoản của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}