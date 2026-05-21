/**
 * src/pages/OrdersPage.jsx
 * Danh sách đơn hàng — gọi /api/customer/don-hang
 */
import { useState, useEffect } from "react";
import api from "../api";
import { S, fmtD } from "../styles/theme";
import GoldBtn from "../components/shared/GoldBtn";
import Badge from "../components/shared/Badge";

export default function OrdersPage({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filter !== "all") params.trang_thai = filter;
      const { data } = await api.get("/customer/don-hang", { params });
      setOrders(data.data || []);
    } catch (err) {
      setError("Không thể tải đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    setCancelling(id);
    try {
      await api.patch(`/customer/don-hang/${id}/huy`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Hủy thất bại");
    } finally {
      setCancelling(null);
    }
  };

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xử lý" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "checked_in", label: "Đang ở" },
    { key: "checked_out", label: "Đã trả phòng" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: S.darkBg, padding: "40px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: S.text, margin: 0 }}>
          Đơn hàng của tôi
        </h1>
        <GoldBtn onClick={() => setPage("rooms")} small>+ Đặt phòng mới</GoldBtn>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: filter === t.key ? `1.5px solid ${S.gold}` : `1px solid rgba(201,168,76,0.25)`,
              background: filter === t.key ? "rgba(201,168,76,0.12)" : "transparent",
              color: filter === t.key ? S.gold : S.muted,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: S.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>Đang tải đơn hàng...</p>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.4)", color: S.danger, padding: "14px 20px", borderRadius: 8, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: S.muted }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ fontSize: 18, marginBottom: 8 }}>Chưa có đơn hàng nào</p>
          <p style={{ fontSize: 13, marginBottom: 24 }}>Hãy đặt phòng để bắt đầu trải nghiệm.</p>
          <GoldBtn onClick={() => setPage("rooms")}>Khám phá phòng ngay</GoldBtn>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((order) => {
          const room = order.id_phong;
          const nights = room
            ? Math.max(1, Math.ceil((new Date(order.ngay_checkout) - new Date(order.ngay_checkin)) / 86400000))
            : 1;
          const canCancel = ["pending", "confirmed"].includes(order.trang_thai);

          return (
            <div
              key={order._id}
              style={{
                background: S.darkCard,
                border: `1px solid ${S.border}`,
                borderRadius: 10,
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "140px 1fr auto",
                gap: 0,
              }}
            >
              {/* Room image */}
              <div style={{ background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {room?.hinh_anh ? (
                  <img src={room.hinh_anh} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 40 }}>🏨</span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: S.muted, fontFamily: "monospace" }}>{order.ma_datphong}</span>
                  <Badge status={order.trang_thai} />
                </div>

                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: S.text, margin: "0 0 6px" }}>
                  {room ? `Phòng ${room.so_phong} — ${room.loai_phong}` : "Thông tin phòng"}
                </h3>

                <div style={{ display: "flex", gap: 20, fontSize: 12, color: S.muted, marginBottom: 8 }}>
                  <span>📅 {fmtD(order.ngay_checkin)} → {fmtD(order.ngay_checkout)}</span>
                  <span>🌙 {nights} đêm</span>
                </div>

                <div style={{ color: S.gold, fontWeight: 700, fontSize: 18 }}>
                  ${order.tong_tien?.toLocaleString()}
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10, justifyContent: "center", borderLeft: `1px solid ${S.border}` }}>
                <GoldBtn small onClick={() => setPage("history")}>Chi tiết</GoldBtn>
                {canCancel && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={cancelling === order._id}
                    style={{
                      padding: "7px 18px",
                      background: "transparent",
                      border: `1px solid ${S.danger}`,
                      color: S.danger,
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {cancelling === order._id ? "Đang hủy..." : "Hủy đơn"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}