/**
 * src/pages/HistoryPage.jsx
 * Lịch sử đặt phòng — gọi /api/customer/lich-su
 */
import { useState, useEffect } from "react";
import api from "../api";
import { S, fmtD } from "../styles/theme";
import GoldBtn from "../components/shared/GoldBtn";
import Badge from "../components/shared/Badge";

export default function HistoryPage({ setPage }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ tong_don_hang: 0, tong_chi_tieu: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/customer/lich-su");
        setHistory(data.lich_su || []);
        setStats(data.thong_ke || { tong_don_hang: 0, tong_chi_tieu: 0 });
      } catch {
        setError("Không thể tải lịch sử. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: S.darkBg, padding: "40px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: S.text, margin: 0 }}>
          Lịch sử đặt phòng
        </h1>
        <GoldBtn small onClick={() => setPage("rooms")}>+ Đặt phòng mới</GoldBtn>
      </div>

      {/* Stats cards */}
      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { icon: "📋", label: "Tổng đơn hàng", value: stats.tong_don_hang },
            { icon: "💰", label: "Tổng chi tiêu", value: `$${stats.tong_chi_tieu?.toLocaleString() || 0}` },
            { icon: "✅", label: "Đã hoàn thành", value: history.filter(h => h.don_hang?.trang_thai === "checked_out").length },
          ].map((s) => (
            <div key={s.label} style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 32 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: S.gold, fontWeight: 700 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: S.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>Đang tải lịch sử...</p>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.4)", color: S.danger, padding: "14px 20px", borderRadius: 8, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: S.muted }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📜</div>
          <p style={{ fontSize: 18, marginBottom: 8 }}>Chưa có lịch sử đặt phòng</p>
          <GoldBtn onClick={() => setPage("rooms")} style={{ marginTop: 12 }}>Đặt phòng ngay</GoldBtn>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {history.map(({ don_hang, thanh_toan, danh_gia }, idx) => {
          if (!don_hang) return null;
          const room = don_hang.id_phong;
          const nights = Math.max(1, Math.ceil(
            (new Date(don_hang.ngay_checkout) - new Date(don_hang.ngay_checkin)) / 86400000
          ));

          return (
            <div
              key={don_hang._id || idx}
              style={{
                background: S.darkCard,
                border: `1px solid ${S.border}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 12, color: S.muted, fontFamily: "monospace" }}>{don_hang.ma_datphong}</span>
                  <Badge status={don_hang.trang_thai} />
                  {thanh_toan && (
                    <span style={{ fontSize: 11, background: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.3)", color: S.success, padding: "2px 8px", borderRadius: 20 }}>
                      Đã thanh toán
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: S.muted }}>
                  Đặt ngày: {fmtD(don_hang.createdAt)}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                {/* Room info */}
                <div>
                  <p style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Phòng</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {room?.hinh_anh && (
                      <img src={room.hinh_anh} alt="" style={{ width: 60, height: 45, objectFit: "cover", borderRadius: 6 }} />
                    )}
                    <div>
                      <div style={{ color: S.text, fontWeight: 600, fontSize: 14 }}>
                        {room ? `Phòng ${room.so_phong}` : "—"}
                      </div>
                      <div style={{ fontSize: 12, color: S.muted }}>{room?.loai_phong}</div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <p style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Thời gian lưu trú</p>
                  <div style={{ color: S.text, fontSize: 14 }}>
                    {fmtD(don_hang.ngay_checkin)} → {fmtD(don_hang.ngay_checkout)}
                  </div>
                  <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>{nights} đêm</div>
                </div>

                {/* Payment */}
                <div>
                  <p style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Thanh toán</p>
                  <div style={{ color: S.gold, fontWeight: 700, fontSize: 20 }}>
                    ${don_hang.tong_tien?.toLocaleString()}
                  </div>
                  {thanh_toan && (
                    <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>
                      {thanh_toan.phuong_thuc === "card" ? "💳 Thẻ" : thanh_toan.phuong_thuc === "transfer" ? "🏦 Chuyển khoản" : "💵 Tiền mặt"}
                    </div>
                  )}
                </div>
              </div>

              {/* Review section */}
              {don_hang.trang_thai === "checked_out" && (
                <div style={{ padding: "14px 24px", borderTop: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {danh_gia ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "#C9A84C", fontSize: 16 }}>{"★".repeat(danh_gia.diem_so)}{"☆".repeat(5 - danh_gia.diem_so)}</span>
                      <span style={{ fontSize: 13, color: S.muted }}>"{danh_gia.noi_dung}"</span>
                      {danh_gia.trang_thai === "pending" && (
                        <span style={{ fontSize: 11, color: S.warning }}>Chờ duyệt</span>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 13, color: S.muted }}>Bạn chưa đánh giá kỳ nghỉ này</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}