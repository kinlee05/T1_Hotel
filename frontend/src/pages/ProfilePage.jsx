/**
 * src/pages/ProfilePage.jsx
 * Trang tài khoản — xem & cập nhật thông tin cá nhân, đổi mật khẩu.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { S } from "../styles/theme";
import GoldBtn from "../components/shared/GoldBtn";

export default function ProfilePage() {
  const { user, changePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("info");

  // Form state
  const [form, setForm] = useState({ ho_ten: "", sdt: "", dia_chi: "", ngay_sinh: "", gioi_tinh: "" });
  const [pwForm, setPwForm] = useState({ mat_khau_cu: "", mat_khau_moi: "", confirm: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/customer/profile");
        setProfile(data);
        setForm({
          ho_ten: data.ho_ten || "",
          sdt: data.sdt || "",
          dia_chi: data.dia_chi || "",
          ngay_sinh: data.ngay_sinh ? data.ngay_sinh.split("T")[0] : "",
          gioi_tinh: data.gioi_tinh || "",
        });
      } catch {
        // Nếu không có profile (admin/staff), dùng user context
        if (user) {
          setForm({ ho_ten: user.ho_ten || "", sdt: "", dia_chi: "", ngay_sinh: "", gioi_tinh: "" });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await api.patch("/customer/profile", form);
      setMsg({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Cập nhật thất bại" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePw = async () => {
    if (pwForm.mat_khau_moi !== pwForm.confirm) {
      setMsg({ type: "error", text: "Mật khẩu mới không khớp" });
      return;
    }
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await changePassword(pwForm.mat_khau_cu, pwForm.mat_khau_moi);
      setMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPwForm({ mat_khau_cu: "", mat_khau_moi: "", confirm: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Đổi mật khẩu thất bại" });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "info", label: "Thông tin cá nhân" },
    { key: "password", label: "Đổi mật khẩu" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: S.muted }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: S.darkBg, padding: "40px 60px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: S.text, marginBottom: 32 }}>
        Tài khoản của tôi
      </h1>

      {/* Avatar + summary */}
      <div style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: 28, display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, fontWeight: 700, color: "#0A0A0A", flexShrink: 0,
        }}>
          {(form.ho_ten || user?.ho_ten || "?")[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: S.text, margin: 0 }}>
            {form.ho_ten || user?.ho_ten}
          </h2>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>{user?.email}</p>
          <span style={{ fontSize: 11, background: "rgba(201,168,76,0.15)", border: `1px solid rgba(201,168,76,0.4)`, color: S.gold, padding: "2px 10px", borderRadius: 20, marginTop: 6, display: "inline-block" }}>
            {user?.vai_tro === "khach_hang" ? "Khách hàng" : user?.vai_tro}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${S.border}`, paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setMsg({ type: "", text: "" }); }}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: "none",
              borderBottom: tab === t.key ? `2px solid ${S.gold}` : "2px solid transparent",
              color: tab === t.key ? S.gold : S.muted,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {msg.text && (
        <div style={{
          background: msg.type === "success" ? "rgba(46,204,113,0.12)" : "rgba(231,76,60,0.12)",
          border: `1px solid ${msg.type === "success" ? "rgba(46,204,113,0.4)" : "rgba(231,76,60,0.4)"}`,
          color: msg.type === "success" ? S.success : S.danger,
          padding: "12px 16px", borderRadius: 6, fontSize: 13, marginBottom: 20,
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ background: S.darkCard, border: `1px solid ${S.border}`, borderRadius: 10, padding: 28, maxWidth: 600 }}>
        {tab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Họ tên</label>
              <input value={form.ho_ten} onChange={(e) => setForm({ ...form, ho_ten: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Số điện thoại</label>
              <input value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Ngày sinh</label>
              <input type="date" value={form.ngay_sinh} onChange={(e) => setForm({ ...form, ngay_sinh: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Giới tính</label>
              <select value={form.gioi_tinh} onChange={(e) => setForm({ ...form, gioi_tinh: e.target.value })} style={inp}>
                <option value="">-- Chọn --</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Địa chỉ</label>
              <input value={form.dia_chi} onChange={(e) => setForm({ ...form, dia_chi: e.target.value })} style={inp} />
            </div>
            <GoldBtn onClick={handleSave} style={{ alignSelf: "flex-start" }}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </GoldBtn>
          </div>
        )}

        {tab === "password" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Mật khẩu hiện tại</label>
              <input type="password" value={pwForm.mat_khau_cu} onChange={(e) => setPwForm({ ...pwForm, mat_khau_cu: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Mật khẩu mới</label>
              <input type="password" value={pwForm.mat_khau_moi} onChange={(e) => setPwForm({ ...pwForm, mat_khau_moi: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Xác nhận mật khẩu mới</label>
              <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} style={inp} />
            </div>
            <GoldBtn onClick={handleChangePw} style={{ alignSelf: "flex-start" }}>
              {saving ? "Đang xử lý..." : "Đổi mật khẩu"}
            </GoldBtn>
          </div>
        )}
      </div>
    </div>
  );
}
