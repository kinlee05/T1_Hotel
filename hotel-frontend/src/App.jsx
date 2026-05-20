import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Home, CalendarDays, Users, UserCog, DollarSign,
  LogOut, Search, Plus, Edit2, Trash2, Eye, X, Check, ChevronDown,
  ArrowLeft, RotateCcw, Menu, Bell, TrendingUp, TrendingDown,
  BedDouble, Wrench, Filter
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ─── CONFIG ───────────────────────────────────────────────────
const API = "http://localhost:3000/api";

// ─── MOCK DATA (fallback khi chưa có backend) ─────────────────
const MOCK = {
  dashboard: {
    phong: { tong: 50, trong: 12, dang_o: 30, bao_duong: 8 },
    dat_phong: {
      tong: 231,
      theo_trang_thai: [
        { _id: "pending", so_luong: 12 },
        { _id: "confirmed", so_luong: 40 },
        { _id: "checked_in", so_luong: 25 },
        { _id: "cancelled", so_luong: 8 },
      ],
    },
    tong_doanh_thu: 123980,
    dat_phong_gan_day: [
      { ma_datphong: "B001", id_khachhang: { ho_ten: "John" }, id_phong: { so_phong: "101", loai_phong: "Standard" }, ngay_checkin: "2025-06-12", trang_thai: "checked_in" },
      { ma_datphong: "B002", id_khachhang: { ho_ten: "Anna" }, id_phong: { so_phong: "205", loai_phong: "Deluxe" }, ngay_checkin: "2025-06-14", trang_thai: "pending" },
      { ma_datphong: "B003", id_khachhang: { ho_ten: "Mike" }, id_phong: { so_phong: "208", loai_phong: "Deluxe" }, ngay_checkin: "2025-06-14", trang_thai: "confirmed" },
      { ma_datphong: "B004", id_khachhang: { ho_ten: "Steve" }, id_phong: { so_phong: "301", loai_phong: "Suite" }, ngay_checkin: "2025-06-17", trang_thai: "confirmed" },
      { ma_datphong: "B005", id_khachhang: { ho_ten: "Mary" }, id_phong: { so_phong: "303", loai_phong: "Suite" }, ngay_checkin: "2025-06-17", trang_thai: "confirmed" },
      { ma_datphong: "B006", id_khachhang: { ho_ten: "Josh" }, id_phong: { so_phong: "206", loai_phong: "Deluxe" }, ngay_checkin: "2025-06-18", trang_thai: "pending" },
    ],
    doanh_thu_theo_thang: [
      { _id: { thang: 1, nam: 2025 }, tong: 11200 },
      { _id: { thang: 2, nam: 2025 }, tong: 12000 },
      { _id: { thang: 3, nam: 2025 }, tong: 14500 },
      { _id: { thang: 4, nam: 2025 }, tong: 16000 },
      { _id: { thang: 5, nam: 2025 }, tong: 18000 },
      { _id: { thang: 6, nam: 2025 }, tong: 13800 },
    ],
  },
  rooms: {
    total: 20, page: 1,
    data: [
      { _id: "r1", so_phong: "101", loai_phong: "Standard", tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: "Wifi, TV, Air Conditioner", mo_ta: "Spacious and comfortable room with balcony view.", trang_thai: "occupied" },
      { _id: "r2", so_phong: "102", loai_phong: "Standard", tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: "Wifi, TV", mo_ta: "Cozy standard room.", trang_thai: "available" },
      { _id: "r3", so_phong: "103", loai_phong: "Standard", tang: 1, gia_moi_dem: 120, so_giuong: 1, dien_tich: 30, suc_chua: 1, tien_nghi: "Wifi, TV", mo_ta: "Single standard room.", trang_thai: "available" },
      { _id: "r4", so_phong: "104", loai_phong: "Standard", tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: "Wifi", mo_ta: "Standard room.", trang_thai: "maintenance" },
      { _id: "r5", so_phong: "105", loai_phong: "Standard", tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: "Wifi, TV", mo_ta: "Standard room.", trang_thai: "available" },
      { _id: "r6", so_phong: "201", loai_phong: "Deluxe", tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: "Wifi, TV, Mini bar, Air Conditioner", mo_ta: "Deluxe room with city view.", trang_thai: "available" },
      { _id: "r7", so_phong: "202", loai_phong: "Deluxe", tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: "Wifi, TV, Mini bar", mo_ta: "Elegant deluxe room.", trang_thai: "available" },
      { _id: "r8", so_phong: "205", loai_phong: "Deluxe", tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: "Wifi, TV, Mini bar, Bathtub", mo_ta: "Premium deluxe with bathtub.", trang_thai: "occupied" },
      { _id: "r9", so_phong: "301", loai_phong: "Suite", tang: 3, gia_moi_dem: 350, so_giuong: 1, dien_tich: 80, suc_chua: 4, tien_nghi: "Wifi, TV, Jacuzzi, Mini bar, Balcony", mo_ta: "Luxurious suite with panoramic view.", trang_thai: "occupied" },
      { _id: "r10", so_phong: "302", loai_phong: "Suite", tang: 3, gia_moi_dem: 350, so_giuong: 1, dien_tich: 80, suc_chua: 4, tien_nghi: "Wifi, TV, Jacuzzi, Mini bar", mo_ta: "Executive suite.", trang_thai: "available" },
    ]
  },
  reservations: {
    data: [
      { _id: "d1", ma_datphong: "B001", id_khachhang: { ho_ten: "John", email: "john@gmail.com", sdt: "+84 034 729 623" }, id_phong: { so_phong: "101", loai_phong: "Standard" }, ngay_checkin: "2025-06-12", ngay_checkout: "2025-06-14", tong_tien: 240, trang_thai: "checked_in", yeu_cau_dac_biet: "High floor room, non-smoking" },
      { _id: "d2", ma_datphong: "B002", id_khachhang: { ho_ten: "Anna", email: "anna@gmail.com", sdt: "+84 018 293 048" }, id_phong: { so_phong: "205", loai_phong: "Deluxe" }, ngay_checkin: "2025-06-14", ngay_checkout: "2025-06-15", tong_tien: 180, trang_thai: "pending", yeu_cau_dac_biet: "" },
      { _id: "d3", ma_datphong: "B003", id_khachhang: { ho_ten: "Mike", email: "mike@gmail.com", sdt: "+84 074 839 281" }, id_phong: { so_phong: "208", loai_phong: "Deluxe" }, ngay_checkin: "2025-06-14", ngay_checkout: "2025-06-17", tong_tien: 540, trang_thai: "confirmed", yeu_cau_dac_biet: "" },
      { _id: "d4", ma_datphong: "B004", id_khachhang: { ho_ten: "Steve", email: "steve@gmail.com", sdt: "+84 012 938 475" }, id_phong: { so_phong: "301", loai_phong: "Suite" }, ngay_checkin: "2025-06-17", ngay_checkout: "2025-06-19", tong_tien: 700, trang_thai: "confirmed", yeu_cau_dac_biet: "Late checkout" },
      { _id: "d5", ma_datphong: "B005", id_khachhang: { ho_ten: "Mary", email: "mary@gmail.com", sdt: "+84 019 283 746" }, id_phong: { so_phong: "303", loai_phong: "Suite" }, ngay_checkin: "2025-06-17", ngay_checkout: "2025-06-18", tong_tien: 350, trang_thai: "cancelled", yeu_cau_dac_biet: "" },
      { _id: "d6", ma_datphong: "B006", id_khachhang: { ho_ten: "Josh", email: "josh@gmail.com", sdt: "+84 049 372 859" }, id_phong: { so_phong: "206", loai_phong: "Deluxe" }, ngay_checkin: "2025-06-18", ngay_checkout: "2025-06-19", tong_tien: 180, trang_thai: "pending", yeu_cau_dac_biet: "" },
      { _id: "d7", ma_datphong: "B007", id_khachhang: { ho_ten: "Angus", email: "angus@gmail.com", sdt: "+84 039 482 761" }, id_phong: { so_phong: "104", loai_phong: "Standard" }, ngay_checkin: "2025-06-12", ngay_checkout: "2025-06-15", tong_tien: 360, trang_thai: "checked_in", yeu_cau_dac_biet: "" },
      { _id: "d8", ma_datphong: "B008", id_khachhang: { ho_ten: "Catherine", email: "cat@gmail.com", sdt: "+84 039 281 940" }, id_phong: { so_phong: "207", loai_phong: "Deluxe" }, ngay_checkin: "2025-06-16", ngay_checkout: "2025-06-18", tong_tien: 360, trang_thai: "confirmed", yeu_cau_dac_biet: "" },
      { _id: "d9", ma_datphong: "B009", id_khachhang: { ho_ten: "Edgar", email: "ed@gmail.com", sdt: "+84 019 283 920" }, id_phong: { so_phong: "103", loai_phong: "Standard" }, ngay_checkin: "2025-06-19", ngay_checkout: "2025-06-20", tong_tien: 120, trang_thai: "confirmed", yeu_cau_dac_biet: "Extra pillow" },
    ]
  },
  customers: {
    data: [
      { _id: "c1", ma_khachhang: "C001", ho_ten: "John", ten_hien_thi: "JH", email: "john@gmail.com", sdt: "+84 034 729 623", ngay_sinh: "1984-03-17", quoc_tich: "British", gioi_tinh: "Male", so_cmnd_passport: "123456789", dia_chi: "17 Grenoble Road", ghi_chu: "VIP customer - prefers quiet room" },
      { _id: "c2", ma_khachhang: "C002", ho_ten: "Anna", ten_hien_thi: "AN", email: "anna@example.com", sdt: "0182930482", ngay_sinh: "1990-05-22", quoc_tich: "Vietnamese", gioi_tinh: "Female", so_cmnd_passport: "987654321", dia_chi: "45 Bach Dang", ghi_chu: "" },
      { _id: "c3", ma_khachhang: "C003", ho_ten: "Mike", ten_hien_thi: "MK", email: "mike@example.com", sdt: "0748392812", ngay_sinh: "1988-11-10", quoc_tich: "American", gioi_tinh: "Male", so_cmnd_passport: "456789123", dia_chi: "21 Oak Street", ghi_chu: "" },
      { _id: "c4", ma_khachhang: "C004", ho_ten: "Steve", ten_hien_thi: "ST", email: "steve@example.com", sdt: "0129384752", ngay_sinh: "1979-08-30", quoc_tich: "Australian", gioi_tinh: "Male", so_cmnd_passport: "321654987", dia_chi: "88 Harbor Rd", ghi_chu: "" },
      { _id: "c5", ma_khachhang: "C005", ho_ten: "Mary", ten_hien_thi: "MY", email: "mary@example.com", sdt: "0192837465", ngay_sinh: "1995-02-14", quoc_tich: "French", gioi_tinh: "Female", so_cmnd_passport: "654987321", dia_chi: "12 Rue de Lyon", ghi_chu: "Allergic to feathers" },
      { _id: "c6", ma_khachhang: "C006", ho_ten: "Josh", ten_hien_thi: "JS", email: "jossh@example.com", sdt: "0493728592", ngay_sinh: "1993-07-05", quoc_tich: "Canadian", gioi_tinh: "Male", so_cmnd_passport: "789123456", dia_chi: "99 Maple Ave", ghi_chu: "" },
      { _id: "c7", ma_khachhang: "C007", ho_ten: "Angus", ten_hien_thi: "AG", email: "angus@example.com", sdt: "0394827618", ngay_sinh: "1987-09-25", quoc_tich: "Scottish", gioi_tinh: "Male", so_cmnd_passport: "112233445", dia_chi: "5 Thistle St", ghi_chu: "" },
      { _id: "c8", ma_khachhang: "C008", ho_ten: "Catherine", ten_hien_thi: "CT", email: "catherine@example.com", sdt: "0392819402", ngay_sinh: "1991-12-03", quoc_tich: "British", gioi_tinh: "Female", so_cmnd_passport: "556677889", dia_chi: "30 Windsor Ln", ghi_chu: "Prefers top floor" },
      { _id: "c9", ma_khachhang: "C009", ho_ten: "Edgar", ten_hien_thi: "ED", email: "ed@example.com", sdt: "019283920", ngay_sinh: "1982-06-18", quoc_tich: "German", gioi_tinh: "Male", so_cmnd_passport: "998877665", dia_chi: "77 Berlin Platz", ghi_chu: "" },
    ]
  },
  employees: {
    data: [
      { _id: "e1", ma_nhanvien: "E001", ho_ten: "John Smith", email: "john@email.com", sdt: "034 729 623", vai_tro: "Manager", trang_thai: "active", ten_dang_nhap: "john.smith", lan_dang_nhap_cuoi: "2024-11-18", ngay_vao_lam: "2025-06-12", phong_ban: "Front Office", ca_lam: "Morning", luong: 1200 },
      { _id: "e2", ma_nhanvien: "E002", ho_ten: "Anna Tran", email: "anna@email.com", sdt: "0182930482", vai_tro: "Housekeeping", trang_thai: "active", ten_dang_nhap: "anna.tran", lan_dang_nhap_cuoi: "2024-11-17", ngay_vao_lam: "2024-01-15", phong_ban: "Housekeeping", ca_lam: "Morning", luong: 800 },
      { _id: "e3", ma_nhanvien: "E003", ho_ten: "Mike Nguyen", email: "mike@email.com", sdt: "0748392812", vai_tro: "Receptionist", trang_thai: "active", ten_dang_nhap: "mike.nguyen", lan_dang_nhap_cuoi: "2024-11-18", ngay_vao_lam: "2023-08-01", phong_ban: "Front Office", ca_lam: "Afternoon", luong: 900 },
      { _id: "e4", ma_nhanvien: "E004", ho_ten: "Steve Le", email: "steve@email.com", sdt: "0129384752", vai_tro: "Housekeeping", trang_thai: "active", ten_dang_nhap: "steve.le", lan_dang_nhap_cuoi: "2024-11-16", ngay_vao_lam: "2024-03-20", phong_ban: "Housekeeping", ca_lam: "Afternoon", luong: 800 },
      { _id: "e5", ma_nhanvien: "E005", ho_ten: "Mary Pham", email: "mary@email.com", sdt: "0192837465", vai_tro: "Receptionist", trang_thai: "active", ten_dang_nhap: "mary.pham", lan_dang_nhap_cuoi: "2024-11-15", ngay_vao_lam: "2024-06-01", phong_ban: "Front Office", ca_lam: "Morning", luong: 900 },
      { _id: "e6", ma_nhanvien: "E006", ho_ten: "Josh Vu", email: "josh@email.com", sdt: "0493728592", vai_tro: "Receptionist", trang_thai: "active", ten_dang_nhap: "josh.vu", lan_dang_nhap_cuoi: "2024-11-18", ngay_vao_lam: "2023-12-01", phong_ban: "Front Office", ca_lam: "Night", luong: 950 },
      { _id: "e7", ma_nhanvien: "E007", ho_ten: "Angus Do", email: "angus@email.com", sdt: "0394827618", vai_tro: "Housekeeping", trang_thai: "inactive", ten_dang_nhap: "angus.do", lan_dang_nhap_cuoi: "2024-10-01", ngay_vao_lam: "2023-05-15", phong_ban: "Housekeeping", ca_lam: "Morning", luong: 800 },
    ]
  },
  revenue: {
    this_month_revenue: 18000,
    percent_vs_last_month: 28,
    occupancy_rate: 76,
    avg_room_price: 120,
    revenue_per_room: 92,
    revenue_overview: [
      { label: "Jan", value: 11200 },
      { label: "Feb", value: 12000 },
      { label: "Mar", value: 14500 },
      { label: "Apr", value: 16000 },
      { label: "May", value: 18000 },
      { label: "Jun", value: 13800 },
    ],
    revenue_by_room_type: [
      { _id: "Standard", tong: 45000, so_dat: 120 },
      { _id: "Deluxe", tong: 72000, so_dat: 80 },
      { _id: "Suite", tong: 35000, so_dat: 31 },
    ]
  }
};

// ─── API HELPERS ──────────────────────────────────────────────
const token = () => localStorage.getItem("hotel_token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(`${API}${path}`, { headers: headers(), ...opts });
    if (res.status === 401) { localStorage.removeItem("hotel_token"); window.location.reload(); return null; }
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch {
    return null;
  }
}

// ─── UTILS ────────────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString("en-US", { minimumFractionDigits: 0 }) ?? "0";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }) : "";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── STATUS BADGE ─────────────────────────────────────────────
const STATUS_MAP = {
  available:   { label: "AVAILABLE", cls: "badge-available" },
  occupied:    { label: "OCCUPIED",  cls: "badge-occupied" },
  maintenance: { label: "MAINTENANCE", cls: "badge-maintenance" },
  pending:     { label: "Pending",   cls: "badge-pending" },
  confirmed:   { label: "Confirmed", cls: "badge-confirmed" },
  checked_in:  { label: "Checked-in", cls: "badge-checkedin" },
  checked_out: { label: "Checked-out", cls: "badge-confirmed" },
  cancelled:   { label: "Cancelled",  cls: "badge-cancelled" },
  active:      { label: "Active",     cls: "badge-confirmed" },
  inactive:    { label: "Inactive",   cls: "badge-pending" },
  Manager:     { label: "Manager",    cls: "badge-manager" },
  Receptionist:{ label: "Receptionist", cls: "badge-receptionist" },
  Housekeeping:{ label: "Housekeeping", cls: "badge-housekeeping" },
  Accountant:  { label: "Accountant",  cls: "badge-accountant" },
  IT:          { label: "IT",          cls: "badge-it" },
};
const Badge = ({ status }) => {
  const s = STATUS_MAP[status] ?? { label: status, cls: "badge-pending" };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

// ─── MODAL ────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <span>{title}</span>
        <button onClick={onClose}><X size={18}/></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── CONFIRM DIALOG ───────────────────────────────────────────
const Confirm = ({ msg, onYes, onNo }) => (
  <Modal title="Confirm" onClose={onNo}>
    <p style={{ padding: "20px 0" }}>{msg}</p>
    <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
      <button className="btn-cancel" onClick={onNo}>Cancel</button>
      <button className="btn-danger" onClick={onYes}>Confirm</button>
    </div>
  </Modal>
);

// ═══════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════

// ─── DASHBOARD ───────────────────────────────────────────────
function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/admin/dashboard").then(r => setData(r || MOCK.dashboard));
  }, []);

  if (!data) return <div className="loading">Loading…</div>;

  const chartData = data.doanh_thu_theo_thang.map(d => ({
    name: MONTHS[d._id.thang - 1],
    value: d.tong
  }));

  const statusMap = {};
  data.dat_phong.theo_trang_thai.forEach(s => { statusMap[s._id] = s.so_luong; });

  return (
    <div className="page fade-in">
      <h1 className="page-title">Dashboard</h1>

      {/* Stat Cards */}
      <div className="stat-grid">
        {[
          { label: "Total Rooms", val: data.phong.tong, icon: <Home size={28}/> },
          { label: "Available Rooms", val: data.phong.trong, icon: <BedDouble size={28}/> },
          { label: "Total Bookings", val: data.dat_phong.tong, icon: <CalendarDays size={28}/> },
          { label: "Total Revenue", val: `$${fmt(data.tong_doanh_thu)}`, icon: <DollarSign size={28}/> },
        ].map(c => (
          <div className="stat-card" key={c.label}>
            <div>
              <p className="stat-label">{c.label}</p>
              <p className="stat-val">{c.val}</p>
            </div>
            <div className="stat-icon">{c.icon}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Revenue Chart */}
        <div className="card chart-card">
          <h3 className="card-title">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8a84b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c8a84b" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8"/>
              <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v => [`$${fmt(v)}`, "Revenue"]}/>
              <Area type="monotone" dataKey="value" stroke="#c8a84b" strokeWidth={2} fill="url(#revGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Cards */}
        <div className="status-col">
          <div className="card">
            <h3 className="card-title">Room status</h3>
            <div className="legend-list">
              <div className="legend-item"><span className="dot green"/><span>Available ({data.phong.trong})</span></div>
              <div className="legend-item"><span className="dot blue"/><span>Occupied ({data.phong.dang_o})</span></div>
              <div className="legend-item"><span className="dot red"/><span>Maintenance ({data.phong.bao_duong})</span></div>
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Booking status</h3>
            <div className="legend-list">
              <div className="legend-item"><span className="dot yellow"/><span>Pending ({statusMap.pending || 0})</span></div>
              <div className="legend-item"><span className="dot lime"/><span>Confirmed ({statusMap.confirmed || 0})</span></div>
              <div className="legend-item"><span className="dot green"/><span>Checked-in ({statusMap.checked_in || 0})</span></div>
              <div className="legend-item"><span className="dot red"/><span>Cancelled ({statusMap.cancelled || 0})</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-title">Recent Booking</h3>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Booking ID</th><th>Guest Name</th><th>Room Type</th><th>Room Number</th><th>Check-in</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.dat_phong_gan_day.map(b => (
                <tr key={b.ma_datphong}>
                  <td><strong>{b.ma_datphong}</strong></td>
                  <td>{b.id_khachhang?.ho_ten}</td>
                  <td>{b.id_phong?.loai_phong}</td>
                  <td>R{b.id_phong?.so_phong}</td>
                  <td>{fmtDate(b.ngay_checkin)}</td>
                  <td><Badge status={b.trang_thai}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── MANAGE ROOMS ─────────────────────────────────────────────
function ManageRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list"); // list | detail | edit | add
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    const r = await apiFetch(`/admin/phong?search=${search}&trang_thai=${filter === "all" ? "" : filter}`);
    setRooms((r?.data) || MOCK.rooms.data);
  }, [search, filter]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const openDetail = async (room) => {
    const r = await apiFetch(`/admin/phong/${room._id}`);
    setSelected(r ? { ...r.phong, lich_su: r.lich_su_dat_phong } : { ...room, lich_su: [] });
    setView("detail");
  };

  const openEdit = (room) => {
    setForm({ ...room });
    setSelected(room);
    setView("edit");
  };

  const openAdd = () => {
    setForm({ so_phong: "", loai_phong: "Standard", tang: 1, gia_moi_dem: "", so_giuong: 1, dien_tich: "", suc_chua: 2, tien_nghi: "", mo_ta: "", trang_thai: "available" });
    setView("add");
  };

  const saveEdit = async () => {
    const r = await apiFetch(`/admin/phong/${form._id}`, { method: "PUT", body: JSON.stringify(form) });
    if (r) { showToast("Room updated!"); load(); setView("list"); }
    else {
      // mock update
      setRooms(prev => prev.map(rm => rm._id === form._id ? { ...rm, ...form } : rm));
      showToast("Room updated (mock)!"); setView("list");
    }
  };

  const saveAdd = async () => {
    const r = await apiFetch("/admin/phong", { method: "POST", body: JSON.stringify(form) });
    if (r) { showToast("Room created!"); load(); setView("list"); }
    else {
      setRooms(prev => [...prev, { ...form, _id: `r${Date.now()}` }]);
      showToast("Room created (mock)!"); setView("list");
    }
  };

  const deleteRoom = async (room) => {
    const r = await apiFetch(`/admin/phong/${room._id}`, { method: "DELETE" });
    if (r || true) {
      setRooms(prev => prev.filter(rm => rm._id !== room._id));
      showToast("Room deleted!", "success");
    }
    setConfirm(null);
  };

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    return r.so_phong?.toLowerCase().includes(q) || r.loai_phong?.toLowerCase().includes(q);
  }).filter(r => filter === "all" || r.trang_thai === filter);

  // ── Detail View ──
  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Room {selected.so_phong}</h1>
          <Badge status={selected.trang_thai}/>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => openEdit(selected)}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="detail-grid">
          <div>
            <p><span className="detail-label">Price:</span> <strong>${selected.gia_moi_dem} / night</strong></p>
            <p><span className="detail-label">Beds:</span> {selected.so_giuong} beds</p>
            <p><span className="detail-label">Size:</span> {selected.dien_tich}m²</p>
            <p><span className="detail-label">Capacity:</span> {selected.suc_chua} guests</p>
            <p><span className="detail-label">Amenities:</span> {selected.tien_nghi}</p>
            <p><span className="detail-label">Description:</span> {selected.mo_ta}</p>
          </div>
          <div className="room-img-placeholder">
            <BedDouble size={64} color="#c8a84b" opacity={0.4}/>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h3 className="card-title">Booking History</h3>
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Booking ID</th><th>Guest Name</th><th>Check-in & Check-out</th><th>Status</th></tr></thead>
            <tbody>
              {selected.lich_su?.length > 0 ? selected.lich_su.map(b => (
                <tr key={b.ma_datphong || b._id}>
                  <td>{b.ma_datphong}</td>
                  <td>{b.id_khachhang?.ho_ten}</td>
                  <td>{fmtDate(b.ngay_checkin)} - {fmtDate(b.ngay_checkout)}</td>
                  <td><Badge status={b.trang_thai}/></td>
                </tr>
              )) : <tr><td colSpan={4} style={{ textAlign:"center", color:"#aaa" }}>No booking history</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── Edit / Add Form ──
  if (view === "edit" || view === "add") return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>{view === "add" ? "Add Room" : `Edit Room ${selected?.so_phong}`}</h1>
        </div>
        {view === "add" && <button className="btn-primary" onClick={saveAdd}>Create Room</button>}
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h4 className="section-title">Room Information</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Room Number</label>
            <input className="inp" value={form.so_phong || ""} onChange={e => setForm(p => ({ ...p, so_phong: e.target.value }))} placeholder="e.g. 101"/>
          </div>
          <div className="form-group">
            <label>Room Type</label>
            <select className="inp" value={form.loai_phong || "Standard"} onChange={e => setForm(p => ({ ...p, loai_phong: e.target.value }))}>
              <option>Standard</option><option>Deluxe</option><option>Suite</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price per Night ($)</label>
            <input className="inp" type="number" value={form.gia_moi_dem || ""} onChange={e => setForm(p => ({ ...p, gia_moi_dem: Number(e.target.value) }))} placeholder="120"/>
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input className="inp" type="number" value={form.suc_chua || ""} onChange={e => setForm(p => ({ ...p, suc_chua: Number(e.target.value) }))} placeholder="2"/>
          </div>
          <div className="form-group">
            <label>Floor</label>
            <input className="inp" type="number" value={form.tang || ""} onChange={e => setForm(p => ({ ...p, tang: Number(e.target.value) }))} placeholder="1"/>
          </div>
          <div className="form-group">
            <label>Beds</label>
            <input className="inp" type="number" value={form.so_giuong || ""} onChange={e => setForm(p => ({ ...p, so_giuong: Number(e.target.value) }))} placeholder="2"/>
          </div>
          <div className="form-group">
            <label>Size (m²)</label>
            <input className="inp" type="number" value={form.dien_tich || ""} onChange={e => setForm(p => ({ ...p, dien_tich: Number(e.target.value) }))} placeholder="35"/>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="inp" value={form.trang_thai || "available"} onChange={e => setForm(p => ({ ...p, trang_thai: e.target.value }))}>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amenities</label>
            <input className="inp" value={form.tien_nghi || ""} onChange={e => setForm(p => ({ ...p, tien_nghi: e.target.value }))} placeholder="Wifi, TV, Air Conditioner"/>
          </div>
        </div>
        <div className="form-group" style={{ marginTop:8 }}>
          <label>Description</label>
          <textarea className="inp" rows={3} value={form.mo_ta || ""} onChange={e => setForm(p => ({ ...p, mo_ta: e.target.value }))} placeholder="Room description…"/>
        </div>
        {view === "edit" && (
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <button className="btn-cancel" onClick={() => setView("list")}>Cancel</button>
            <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── List View ──
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Rooms</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16}/> Add Room</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} color="#aaa"/>
          <input placeholder="Search rooms…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <select className="filter-sel" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="room-grid">
        {filtered.map(room => (
          <div className="room-card" key={room._id} onClick={() => openDetail(room)} style={{ cursor:"pointer" }}>
            <div className="room-card-header">
              <BedDouble size={20} color="#666"/>
              <span className="room-number">Room {room.so_phong}</span>
            </div>
            <p className="room-type">{room.loai_phong} • Floor {room.tang}</p>
            <Badge status={room.trang_thai}/>
            <div className="room-actions">
              <button className="act-btn" onClick={() => openDetail(room)}><Eye size={14}/> View</button>
              <button className="act-btn" onClick={() => openEdit(room)}><Edit2 size={14}/> Edit</button>
              <button className="act-btn danger" onClick={() => setConfirm({ msg: `Delete Room ${room.so_phong}?`, cb: () => deleteRoom(room) })}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      {confirm && <Confirm msg={confirm.msg} onYes={confirm.cb} onNo={() => setConfirm(null)}/>}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

// ─── RESERVATION ─────────────────────────────────────────────
function ReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/dat-phong");
    setReservations(r?.data || MOCK.reservations.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = reservations.filter(r => {
    const q = search.toLowerCase();
    return r.ma_datphong?.toLowerCase().includes(q) ||
      r.id_khachhang?.ho_ten?.toLowerCase().includes(q) ||
      r.id_phong?.so_phong?.includes(q);
  }).filter(r => filter === "all" || r.trang_thai === filter);

  const changeStatus = async (res, action) => {
    const path = action === "confirm" ? `/admin/dat-phong/${res._id}/xac-nhan` : `/admin/dat-phong/${res._id}/huy`;
    const r = await apiFetch(path, { method: "PATCH" });
    const newStatus = action === "confirm" ? "confirmed" : "cancelled";
    setReservations(prev => prev.map(rv => rv._id === res._id ? { ...rv, trang_thai: newStatus } : rv));
    showToast(`Booking ${newStatus}!`);
  };

  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Reservation Detail</h1>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => { setForm({ ...selected }); setView("edit"); }}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="detail-grid-2">
          <div><span className="detail-label">Booking ID</span><p><strong>{selected.ma_datphong}</strong></p></div>
          <div><span className="detail-label">Status</span><p><Badge status={selected.trang_thai}/></p></div>
          <div><span className="detail-label">Guest Name</span><p>{selected.id_khachhang?.ho_ten}</p></div>
          <div><span className="detail-label">Phone</span><p>{selected.id_khachhang?.sdt}</p></div>
          <div><span className="detail-label">Email</span><p>{selected.id_khachhang?.email}</p></div>
          <div><span className="detail-label">Room</span><p>R{selected.id_phong?.so_phong} - {selected.id_phong?.loai_phong} Room</p></div>
          <div><span className="detail-label">Check-in</span><p>{new Date(selected.ngay_checkin).toLocaleDateString("en-GB")}</p></div>
          <div><span className="detail-label">Check-out</span><p>{new Date(selected.ngay_checkout).toLocaleDateString("en-GB")}</p></div>
          <div><span className="detail-label">Total Price</span><p><strong>${fmt(selected.tong_tien)}</strong></p></div>
        </div>
        {selected.yeu_cau_dac_biet && (
          <div className="form-group" style={{ marginTop:12 }}>
            <span className="detail-label">Special Request</span>
            <div className="special-req">{selected.yeu_cau_dac_biet}</div>
          </div>
        )}
      </div>
    </div>
  );

  if (view === "edit" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("detail")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Edit Reservation</h1>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="form-grid">
          <div className="form-group">
            <label>Guest Name</label>
            <input className="inp" value={form.id_khachhang?.ho_ten || ""} readOnly/>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="inp" value={form.id_khachhang?.sdt || ""} readOnly/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="inp" value={form.id_khachhang?.email || ""} readOnly/>
          </div>
          <div className="form-group">
            <label>Room</label>
            <select className="inp">
              <option>R{form.id_phong?.so_phong} - {form.id_phong?.loai_phong} Room</option>
            </select>
          </div>
          <div className="form-group">
            <label>Check-in</label>
            <input className="inp" type="date" value={form.ngay_checkin?.split("T")[0] || ""} onChange={e => setForm(p => ({ ...p, ngay_checkin: e.target.value }))}/>
          </div>
          <div className="form-group">
            <label>Check-out</label>
            <input className="inp" type="date" value={form.ngay_checkout?.split("T")[0] || ""} onChange={e => setForm(p => ({ ...p, ngay_checkout: e.target.value }))}/>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="inp" value={form.trang_thai || "pending"} onChange={e => setForm(p => ({ ...p, trang_thai: e.target.value }))}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked-in</option>
              <option value="checked_out">Checked-out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginTop:8 }}>
          <label>Special Request</label>
          <textarea className="inp" rows={3} value={form.yeu_cau_dac_biet || ""} onChange={e => setForm(p => ({ ...p, yeu_cau_dac_biet: e.target.value }))}/>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
          <button className="btn-cancel" onClick={() => setView("detail")}>Cancel</button>
          <button className="btn-primary" onClick={() => {
            setReservations(prev => prev.map(rv => rv._id === form._id ? { ...rv, ...form } : rv));
            showToast("Reservation updated!"); setView("list");
          }}>Save Changes</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reservation</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>
      </div>
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} color="#aaa"/>
          <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <select className="filter-sel" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked-in</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="card" style={{ marginTop:0 }}>
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Booking ID</th><th>Guest Name</th><th>Room</th><th>Check-in & Check-out</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.ma_datphong}</strong></td>
                  <td>{r.id_khachhang?.ho_ten}</td>
                  <td>R{r.id_phong?.so_phong}</td>
                  <td>{fmtDate(r.ngay_checkin)} - {fmtDate(r.ngay_checkout)}</td>
                  <td><Badge status={r.trang_thai}/></td>
                  <td>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <button className="icon-btn" onClick={() => { setSelected(r); setView("detail"); }}><Eye size={15}/></button>
                      <button className="icon-btn" onClick={() => { setSelected(r); setForm({ ...r }); setView("edit"); }}><Edit2 size={15}/></button>
                      {r.trang_thai === "pending" && <button className="act-btn green" onClick={() => changeStatus(r, "confirm")}>Confirm</button>}
                      {["pending","confirmed","checked_in"].includes(r.trang_thai) && <button className="act-btn red" onClick={() => changeStatus(r, "cancel")}>Cancel</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}

// ─── CUSTOMERS ───────────────────────────────────────────────
function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/khach-hang");
    setCustomers(r?.data || MOCK.customers.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return c.ho_ten?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.sdt?.includes(q);
  });

  const del = async (c) => {
    await apiFetch(`/admin/khach-hang/${c._id}`, { method: "DELETE" });
    setCustomers(prev => prev.filter(x => x._id !== c._id));
    showToast("Customer deleted!"); setConfirm(null);
  };

  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Customer Detail</h1>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => { setForm({ ...selected }); setView("edit"); }}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div className="avatar-section">
          <div className="avatar-big">{selected.ten_hien_thi || selected.ho_ten?.slice(0,2).toUpperCase()}</div>
        </div>
        <div className="detail-grid-2">
          <div><span className="detail-label">ID</span><p><strong>{selected.ma_khachhang}</strong></p></div>
          <div><span className="detail-label">Display Name</span><p>{selected.ten_hien_thi}</p></div>
          <div><span className="detail-label">Guest Name</span><p>{selected.ho_ten}</p></div>
          <div><span className="detail-label">Phone</span><p>{selected.sdt}</p></div>
          <div><span className="detail-label">Email</span><p>{selected.email}</p></div>
          <div><span className="detail-label">Date of Birth</span><p>{selected.ngay_sinh ? new Date(selected.ngay_sinh).toLocaleDateString("en-GB") : "-"}</p></div>
          <div><span className="detail-label">Nationality</span><p>{selected.quoc_tich}</p></div>
          <div><span className="detail-label">Gender</span><p>{selected.gioi_tinh}</p></div>
        </div>
        {selected.ghi_chu && <p style={{ marginTop:8, color:"#666", fontStyle:"italic" }}>{selected.ghi_chu}</p>}
      </div>
    </div>
  );

  if (view === "edit" || view === "add") return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>{view === "add" ? "Add Customer" : "Edit Customer"}</h1>
        </div>
        {view === "add" && <button className="btn-primary" onClick={() => {
          setCustomers(prev => [...prev, { ...form, _id: `c${Date.now()}`, ma_khachhang: `C${String(prev.length+1).padStart(3,"0")}` }]);
          showToast("Customer created!"); setView("list");
        }}>Create Customer</button>}
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h4 className="section-title">Personal Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Full Name</label><input className="inp" value={form.ho_ten||""} onChange={e=>setForm(p=>({...p,ho_ten:e.target.value}))} placeholder="Enter here"/></div>
          <div className="form-group"><label>Phone Number</label><input className="inp" value={form.sdt||""} onChange={e=>setForm(p=>({...p,sdt:e.target.value}))} placeholder="Enter here"/></div>
          <div className="form-group"><label>Email</label><input className="inp" value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="Enter here"/></div>
          <div className="form-group"><label>Date of Birth</label><input className="inp" type="date" value={form.ngay_sinh?.split("T")[0]||""} onChange={e=>setForm(p=>({...p,ngay_sinh:e.target.value}))}/></div>
          <div className="form-group"><label>Gender</label><select className="inp" value={form.gioi_tinh||""} onChange={e=>setForm(p=>({...p,gioi_tinh:e.target.value}))}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div className="form-group"><label>Nationality</label><input className="inp" value={form.quoc_tich||""} onChange={e=>setForm(p=>({...p,quoc_tich:e.target.value}))} placeholder="Enter here"/></div>
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Identification</h4>
        <div className="form-grid">
          <div className="form-group"><label>ID card / Passport</label><input className="inp" value={form.so_cmnd_passport||""} onChange={e=>setForm(p=>({...p,so_cmnd_passport:e.target.value}))} placeholder="Enter ID number"/></div>
          <div className="form-group"><label>Address</label><input className="inp" value={form.dia_chi||""} onChange={e=>setForm(p=>({...p,dia_chi:e.target.value}))} placeholder="Enter here"/></div>
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Additional Information</h4>
        <div className="form-group"><label>Note</label><textarea className="inp" rows={3} value={form.ghi_chu||""} onChange={e=>setForm(p=>({...p,ghi_chu:e.target.value}))} placeholder="Special requests, VIP notes…"/></div>
        {view === "edit" && (
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <button className="btn-cancel" onClick={() => setView("list")}>Cancel</button>
            <button className="btn-primary" onClick={() => {
              setCustomers(prev => prev.map(c => c._id === form._id ? { ...c, ...form } : c));
              showToast("Customer updated!"); setView("list");
            }}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({}); setView("add"); }}><Plus size={16}/> Add Customer</button>
      </div>
      <div className="card" style={{ marginTop:0 }}>
        <div className="toolbar" style={{ marginBottom:0 }}>
          <h3 style={{ margin:0, fontWeight:600 }}>Customers List</h3>
          <div style={{ display:"flex", gap:8 }}>
            <div className="search-box"><Search size={16} color="#aaa"/><input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <div className="table-wrap" style={{ marginTop:12 }}>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Guest Name</th><th>Phone</th><th>Email</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.ma_khachhang}</strong></td>
                  <td>{c.ho_ten}</td>
                  <td>{c.sdt}</td>
                  <td>{c.email}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="icon-btn" onClick={() => { setSelected(c); setView("detail"); }}><Eye size={15}/></button>
                      <button className="icon-btn danger" onClick={() => setConfirm({ msg: `Delete customer ${c.ho_ten}?`, cb: () => del(c) })}><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirm && <Confirm msg={confirm.msg} onYes={confirm.cb} onNo={() => setConfirm(null)}/>}
      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}

// ─── EMPLOYEES ───────────────────────────────────────────────
function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    const r = await apiFetch("/admin/nhan-vien");
    setEmployees(r?.data || MOCK.employees.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    return e.ho_ten?.toLowerCase().includes(q) || e.vai_tro?.toLowerCase().includes(q) || e.sdt?.includes(q);
  });

  const del = async (e) => {
    await apiFetch(`/admin/nhan-vien/${e._id}`, { method: "DELETE" });
    setEmployees(prev => prev.filter(x => x._id !== e._id));
    showToast("Employee deleted!"); setConfirm(null);
  };

  if (view === "detail" && selected) return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>Employees Detail</h1>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-outline" onClick={() => setView("list")}>Back</button>
          <button className="btn-primary" onClick={() => { setForm({ ...selected }); setView("edit"); }}>Edit</button>
        </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div style={{ display:"flex", gap:24 }}>
          <div className="avatar-big emp">{selected.ho_ten?.split(" ").map(w=>w[0]).slice(-2).join("").toUpperCase()}</div>
          <div style={{ flex:1 }}>
            <h4 className="section-title">Personal Information</h4>
            <div className="detail-grid-2">
              <div><span className="detail-label">ID</span><p>{selected.ma_nhanvien}</p></div>
              <div><span className="detail-label">Phone</span><p>{selected.sdt}</p></div>
              <div><span className="detail-label">Full Name</span><p>{selected.ho_ten}</p></div>
              <div><span className="detail-label">Email</span><p>{selected.email}</p></div>
              <div><span className="detail-label">Role</span><p><Badge status={selected.vai_tro}/></p></div>
              <div><span className="detail-label">Status</span><p><Badge status={selected.trang_thai}/></p></div>
            </div>
            <h4 className="section-title" style={{ marginTop:16 }}>Account Information</h4>
            <div className="detail-grid-2">
              <div><span className="detail-label">Username</span><p>{selected.ten_dang_nhap}</p></div>
              <div><span className="detail-label">Last Login</span><p>{selected.lan_dang_nhap_cuoi ? new Date(selected.lan_dang_nhap_cuoi).toLocaleDateString("en-GB") : "-"}</p></div>
              <div><span className="detail-label">Account Status</span><p><Badge status={selected.trang_thai}/></p></div>
              <div><button className="btn-danger-sm">Reset Password</button></div>
            </div>
            <h4 className="section-title" style={{ marginTop:16 }}>Work Information</h4>
            <div className="detail-grid-2">
              <div><span className="detail-label">Join Date</span><p>{selected.ngay_vao_lam ? new Date(selected.ngay_vao_lam).toLocaleDateString("en-GB") : "-"}</p></div>
              <div><span className="detail-label">Shift</span><p>{selected.ca_lam}</p></div>
              <div><span className="detail-label">Department</span><p>{selected.phong_ban}</p></div>
              <div><span className="detail-label">Salary</span><p>${fmt(selected.luong)} / month</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === "edit" || view === "add") return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn-back" onClick={() => setView("list")}><ArrowLeft size={18}/></button>
          <h1 className="page-title" style={{ margin:0 }}>{view === "add" ? "Add Employee" : "Edit Employees"}</h1>
        </div>
        {view === "add"
          ? <button className="btn-primary" onClick={() => {
              setEmployees(prev => [...prev, { ...form, _id: `e${Date.now()}`, ma_nhanvien: `E${String(prev.length+1).padStart(3,"0")}` }]);
              showToast("Employee created!"); setView("list");
            }}>Create Employee</button>
          : <button className="btn-primary" onClick={() => {
              setEmployees(prev => prev.map(e => e._id === form._id ? { ...e, ...form } : e));
              showToast("Employee updated!"); setView("list");
            }}>Save Change</button>
        }
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <h4 className="section-title">Personal Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Employee ID</label><input className="inp" value={form.ma_nhanvien||""} onChange={e=>setForm(p=>({...p,ma_nhanvien:e.target.value}))} placeholder="Enter ID"/></div>
          <div className="form-group"><label>Phone</label><input className="inp" value={form.sdt||""} onChange={e=>setForm(p=>({...p,sdt:e.target.value}))} placeholder="Enter phone number"/></div>
          <div className="form-group"><label>Full Name</label><input className="inp" value={form.ho_ten||""} onChange={e=>setForm(p=>({...p,ho_ten:e.target.value}))} placeholder="Enter full name"/></div>
          <div className="form-group"><label>Email</label><input className="inp" value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="Enter email"/></div>
          <div className="form-group"><label>Role</label><select className="inp" value={form.vai_tro||"Manager"} onChange={e=>setForm(p=>({...p,vai_tro:e.target.value}))}><option>Manager</option><option>Receptionist</option><option>Housekeeping</option><option>Accountant</option><option>IT</option></select></div>
          <div className="form-group"><label>Status</label><select className="inp" value={form.trang_thai||"active"} onChange={e=>setForm(p=>({...p,trang_thai:e.target.value}))}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Account Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Username</label><input className="inp" value={form.ten_dang_nhap||""} onChange={e=>setForm(p=>({...p,ten_dang_nhap:e.target.value}))} placeholder="Enter username"/></div>
          {view === "add" && <>
            <div className="form-group"><label>Password</label><input className="inp" type="password" placeholder="Enter password"/></div>
            <div className="form-group"><label>Confirm Password</label><input className="inp" type="password" placeholder="Re-enter password"/></div>
          </>}
          {view === "edit" && <div className="form-group" style={{ display:"flex", alignItems:"flex-end" }}><button className="btn-danger-sm" style={{ marginBottom:1 }}>Reset Password</button></div>}
        </div>
        <h4 className="section-title" style={{ marginTop:16 }}>Work Information</h4>
        <div className="form-grid">
          <div className="form-group"><label>Join Date</label><input className="inp" type="date" value={form.ngay_vao_lam?.split("T")[0]||""} onChange={e=>setForm(p=>({...p,ngay_vao_lam:e.target.value}))}/></div>
          <div className="form-group"><label>Shift</label><select className="inp" value={form.ca_lam||"Morning"} onChange={e=>setForm(p=>({...p,ca_lam:e.target.value}))}><option>Morning</option><option>Afternoon</option><option>Night</option></select></div>
          <div className="form-group"><label>Department</label><input className="inp" value={form.phong_ban||""} onChange={e=>setForm(p=>({...p,phong_ban:e.target.value}))} placeholder="Enter department"/></div>
          <div className="form-group"><label>Salary ($/month)</label><input className="inp" type="number" value={form.luong||""} onChange={e=>setForm(p=>({...p,luong:Number(e.target.value)}))} placeholder="Enter salary"/></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-sub">Manage your hotel operations efficiently</p>
        </div>
        
      </div>
      <div className="card" style={{ marginTop:0 }}>
        <div className="toolbar" style={{ marginBottom:0 }}>
          <h3 style={{ margin:0, fontWeight:600 }}>Employees List</h3>
          <div className="search-box"><Search size={16} color="#aaa"/><input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
        </div>
        <div className="table-wrap" style={{ marginTop:12 }}>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id}>
                  <td><strong>{e.ma_nhanvien}</strong></td>
                  <td>{e.ho_ten}</td>
                  <td>{e.sdt}</td>
                  <td><Badge status={e.vai_tro}/></td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="icon-btn" onClick={() => { setSelected(e); setView("detail"); }}><Eye size={15}/></button>
                      
                      <button className="icon-btn danger" onClick={() => setConfirm({ msg: `Delete employee ${e.ho_ten}?`, cb: () => del(e) })}><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirm && <Confirm msg={confirm.msg} onYes={confirm.cb} onNo={() => setConfirm(null)}/>}
      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}

// ─── REVENUE ─────────────────────────────────────────────────
const PIE_COLORS = ["#4e9af1", "#4caf82", "#f5a623"];

function RevenuePage() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [roomType, setRoomType] = useState("All");

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (roomType !== "All") params.set("loai_phong", roomType);
    const r = await apiFetch(`/admin/revenue?${params}`);
    setData(r || MOCK.revenue);
  }, [from, to, roomType]);

  useEffect(() => { load(); }, [load]);

  if (!data) return <div className="loading">Loading…</div>;

  const chartData = data.revenue_overview.map(d => ({ name: d.label, value: d.value }));
  const pieData = data.revenue_by_room_type.map(d => ({ name: d._id, value: d.tong }));

  return (
    <div className="page fade-in">
      <h1 className="page-title">Revenue Management</h1>

      {/* Filters */}
      <div className="rev-filters">
        <div className="form-group"><label>From</label><input className="inp" type="date" value={from} onChange={e => setFrom(e.target.value)}/></div>
        <div className="form-group"><label>To</label><input className="inp" type="date" value={to} onChange={e => setTo(e.target.value)}/></div>
        <div className="form-group"><label>Room Type</label>
          <select className="inp" value={roomType} onChange={e => setRoomType(e.target.value)}>
            <option>All</option><option>Standard</option><option>Deluxe</option><option>Suite</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        <div className="stat-card">
          <div>
            <p className="stat-label">This month Revenue</p>
            <p className="stat-val">${fmt(data.this_month_revenue)}</p>
            <p className={`trend ${data.percent_vs_last_month >= 0 ? "up" : "down"}`}>
              {data.percent_vs_last_month >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
              {Math.abs(data.percent_vs_last_month)}% vs last month
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Occupancy Rate</p><p className="stat-val">{data.occupancy_rate}%</p></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Average Room Price</p><p className="stat-val">${fmt(data.avg_room_price)}</p></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Revenue per room</p><p className="stat-val">${fmt(data.revenue_per_room)}</p></div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Line Chart */}
        <div className="card chart-card">
          <h3 className="card-title">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top:10, right:10, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8a84b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c8a84b" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8"/>
              <XAxis dataKey="name" tick={{ fontSize:12 }}/>
              <YAxis tick={{ fontSize:12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={v => [`$${fmt(v)}`, "Revenue"]}/>
              <Area type="monotone" dataKey="value" stroke="#c8a84b" strokeWidth={2} fill="url(#revGrad2)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="card">
          <h3 className="card-title">Revenue by Room Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
              </Pie>
              <Legend formatter={(v) => <span style={{ fontSize:13 }}>{v}</span>}/>
              <Tooltip formatter={v => `$${fmt(v)}`}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr("");
    const r = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, mat_khau: password })
    });
    setLoading(false);
    if (r?.token) {
      localStorage.setItem("hotel_token", r.token);
      onLogin();
    } else {
      setErr(r?.message || "Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">
          <span className="logo-text">TH</span>
          <span className="logo-sub">HOTEL</span>
        </div>
        <h2 className="login-title">Admin Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input className="inp" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@hotel.com" onKeyDown={e => e.key==="Enter" && submit()}/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="inp" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key==="Enter" && submit()}/>
        </div>
        {err && <p className="err-msg">{err}</p>}
        <button className="btn-login" onClick={submit} disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <p className="login-hint">Demo: admin@hotel.com / 123456</p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "rooms", label: "Manage Rooms", icon: Home },
  { id: "reservation", label: "Reservation", icon: CalendarDays },
  { id: "customers", label: "Customers", icon: Users },
  { id: "employees", label: "Employees", icon: UserCog },
  { id: "revenue", label: "Revenue", icon: DollarSign },
];

function Sidebar({ active, setActive, collapsed, onLogout }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-mark">
          <span>TH</span>
          {!collapsed && <span className="logo-hotel">HOTEL</span>}
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}
            title={collapsed ? label : ""}
          >
            <Icon size={20}/>
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
      <button className="nav-item logout" onClick={onLogout}>
        <LogOut size={20}/>
        {!collapsed && <span>Log out</span>}
      </button>
    </aside>
  );
}

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("hotel_token"));
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("hotel_token");
    setAuthed(false);
  };

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)}/>;

  const PAGES = {
    dashboard: DashboardPage,
    rooms: ManageRoomsPage,
    reservation: ReservationPage,
    customers: CustomersPage,
    employees: EmployeesPage,
    revenue: RevenuePage,
  };
  const Page = PAGES[page] || DashboardPage;

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <Sidebar active={page} setActive={setPage} collapsed={collapsed} onLogout={logout}/>
        <div className="main-col">
          <header className="topbar">
            <button className="menu-btn" onClick={() => setCollapsed(c => !c)}><Menu size={20}/></button>
            <div style={{ flex:1 }}/>
            <div className="topbar-right">
              <div className="admin-pill">
                <div className="admin-avatar">A</div>
                <span>Admin</span>
              </div>
            </div>
          </header>
          <main className="content-area">
            <Page/>
          </main>
        </div>
      </div>
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: #c8a84b;
  --gold-light: #f0e4c0;
  --gold-bg: #fdf8ed;
  --sidebar-w: 220px;
  --sidebar-collapsed: 68px;
  --bg: #f0f2f5;
  --white: #ffffff;
  --text: #1a1a2e;
  --text-2: #6b7280;
  --border: #e5e7eb;
  --shadow: 0 2px 12px rgba(0,0,0,0.07);
  --radius: 14px;
  --radius-sm: 8px;
}

body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

/* LAYOUT */
.app-shell { display: flex; height: 100vh; overflow: hidden; }
.main-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.content-area { flex: 1; overflow-y: auto; padding: 24px; }

/* SIDEBAR */
.sidebar {
  width: var(--sidebar-w);
  background: var(--white);
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  box-shadow: 2px 0 12px rgba(0,0,0,0.06);
  transition: width 0.2s ease;
  z-index: 10;
  overflow: hidden;
}
.sidebar.collapsed { width: var(--sidebar-collapsed); }
.sidebar-logo { padding: 8px 4px 24px; }
.logo-mark { display: flex; flex-direction: column; align-items: flex-start; }
.logo-mark span:first-child {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 2px;
  line-height: 1;
  border: 2px solid var(--gold);
  padding: 2px 8px;
}
.logo-hotel { font-size: 9px; letter-spacing: 4px; color: var(--gold); margin-top: 2px; }
.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: var(--radius-sm);
  border: none; background: none; cursor: pointer;
  color: var(--text-2); font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 500;
  transition: all 0.15s ease; white-space: nowrap;
  text-align: left; width: 100%;
}
.nav-item:hover { background: var(--gold-bg); color: var(--gold); }
.nav-item.active { background: var(--gold-light); color: var(--gold); font-weight: 600; }
.nav-item.logout { margin-top: auto; color: #ef4444; }
.nav-item.logout:hover { background: #fef2f2; }

/* TOPBAR */
.topbar {
  height: 64px; background: var(--white);
  display: flex; align-items: center; padding: 0 24px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  gap: 12px;
}
.menu-btn { background: none; border: none; cursor: pointer; padding: 6px; color: var(--text-2); display: flex; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.admin-pill { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.admin-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), #e8b84b);
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 700;
}

/* PAGE */
.page { max-width: 1200px; }
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.page-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 4px; }
.page-sub { color: var(--text-2); font-size: 13px; margin-bottom: 20px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.section-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 12px; }

/* CARDS */
.card {
  background: var(--white); border-radius: var(--radius);
  padding: 20px; box-shadow: var(--shadow); margin-bottom: 16px;
}
.card-title { font-size: 15px; font-weight: 700; margin-bottom: 16px; }

/* STAT CARDS */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card {
  background: var(--white); border-radius: var(--radius); padding: 20px 20px 16px;
  box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: flex-start;
  transition: transform 0.15s; cursor: default;
}
.stat-card:hover { transform: translateY(-2px); }
.stat-label { font-size: 13px; color: var(--text-2); margin-bottom: 4px; }
.stat-val { font-size: 28px; font-weight: 700; font-family: 'Playfair Display', serif; }
.stat-icon { color: var(--gold); opacity: 0.7; }
.trend { display: flex; align-items: center; gap: 4px; font-size: 12px; margin-top: 6px; }
.trend.up { color: #22c55e; }
.trend.down { color: #ef4444; }

/* DASHBOARD GRID */
.dash-grid { display: grid; grid-template-columns: 1fr 280px; gap: 16px; }
.chart-card { }
.status-col { display: flex; flex-direction: column; gap: 16px; }

/* LEGEND */
.legend-list { display: flex; flex-direction: column; gap: 10px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.dot.green { background: #22c55e; }
.dot.blue { background: #3b82f6; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #eab308; }
.dot.lime { background: #84cc16; }

/* BADGE */
.badge {
  display: inline-block; padding: 3px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 600; white-space: nowrap;
}
.badge-available { background: #dcfce7; color: #15803d; }
.badge-occupied { background: #dbeafe; color: #1d4ed8; }
.badge-maintenance { background: #fee2e2; color: #b91c1c; }
.badge-pending { background: #fef9c3; color: #92400e; }
.badge-confirmed { background: #dcfce7; color: #166534; }
.badge-checkedin { background: #22c55e; color: white; }
.badge-cancelled { background: #fee2e2; color: #b91c1c; }
.badge-manager { background: #ede9fe; color: #6d28d9; }
.badge-receptionist { background: #dbeafe; color: #1d4ed8; }
.badge-housekeeping { background: #fed7aa; color: #9a3412; }
.badge-accountant { background: #fce7f3; color: #9d174d; }
.badge-it { background: #e0f2fe; color: #0369a1; }

/* TABLE */
.table-wrap { overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 14px; }
.tbl th { background: #f0fdf4; padding: 10px 14px; text-align: left; font-weight: 600; color: var(--text-2); font-size: 13px; white-space: nowrap; }
.tbl td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.tbl tr:last-child td { border-bottom: none; }
.tbl tr:hover td { background: #fafafa; }

/* TOOLBAR */
.toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
.search-box {
  display: flex; align-items: center; gap: 8px;
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 8px 12px; min-width: 220px;
}
.search-box input { border: none; outline: none; font-size: 14px; width: 100%; font-family: 'DM Sans', sans-serif; }
.filter-sel {
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 8px 12px; font-family: 'DM Sans', sans-serif; font-size: 14px;
  outline: none; cursor: pointer; background: var(--white);
}

/* ROOM GRID */
.room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
.room-card {
  background: var(--white); border-radius: var(--radius-sm);
  padding: 16px; box-shadow: var(--shadow); border: 1px solid var(--border);
  transition: transform 0.15s, box-shadow 0.15s;
}
.room-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.room-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.room-number { font-weight: 700; font-size: 15px; }
.room-type { font-size: 12px; color: var(--text-2); margin-bottom: 8px; }
.room-actions { display: flex; gap: 6px; margin-top: 10px; }
.act-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 6px; border: none; cursor: pointer;
  font-size: 12px; font-family: 'DM Sans', sans-serif; font-weight: 500;
  background: #f3f4f6; color: var(--text-2); transition: all 0.1s;
}
.act-btn:hover { background: #e5e7eb; }
.act-btn.danger { color: #ef4444; }
.act-btn.danger:hover { background: #fee2e2; }
.act-btn.green { background: #dcfce7; color: #15803d; }
.act-btn.green:hover { background: #bbf7d0; }
.act-btn.red { background: #fee2e2; color: #b91c1c; }
.act-btn.red:hover { background: #fecaca; }
.icon-btn {
  padding: 6px; border: 1px solid var(--border); background: var(--white);
  border-radius: 6px; cursor: pointer; display: flex; align-items: center;
  color: var(--text-2); transition: all 0.1s;
}
.icon-btn:hover { background: #f3f4f6; border-color: #9ca3af; }
.icon-btn.danger:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

/* FORMS */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text-2); }
.inp {
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  padding: 9px 12px; font-family: 'DM Sans', sans-serif; font-size: 14px;
  outline: none; transition: border-color 0.15s; background: var(--white);
  width: 100%;
}
.inp:focus { border-color: var(--gold); }
textarea.inp { resize: vertical; }
select.inp { cursor: pointer; }

/* BUTTONS */
.btn-primary {
  background: var(--gold); color: white; border: none; border-radius: var(--radius-sm);
  padding: 10px 18px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: background 0.15s;
}
.btn-primary:hover { background: #b8943b; }
.btn-outline {
  background: white; color: var(--text); border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); padding: 9px 18px; font-weight: 500;
  font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer;
}
.btn-outline:hover { border-color: #9ca3af; }
.btn-cancel {
  background: #ef4444; color: white; border: none; border-radius: var(--radius-sm);
  padding: 10px 18px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  font-size: 14px; cursor: pointer;
}
.btn-danger {
  background: #ef4444; color: white; border: none; border-radius: var(--radius-sm);
  padding: 10px 18px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  font-size: 14px; cursor: pointer;
}
.btn-danger-sm {
  background: #ef4444; color: white; border: none; border-radius: 6px;
  padding: 7px 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  font-size: 13px; cursor: pointer;
}
.btn-back {
  background: white; border: 1.5px solid var(--border); border-radius: 8px;
  padding: 6px; cursor: pointer; display: flex; align-items: center;
  color: var(--text-2); transition: all 0.1s;
}
.btn-back:hover { background: #f3f4f6; }
.btn-login {
  width: 100%; padding: 12px; background: var(--gold); color: white;
  border: none; border-radius: var(--radius-sm); font-size: 15px;
  font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer;
  margin-top: 8px; transition: background 0.15s;
}
.btn-login:hover { background: #b8943b; }
.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

/* DETAIL */
.detail-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
.detail-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-label { font-size: 12px; color: var(--text-2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.detail-grid p, .detail-grid-2 p { margin-top: 4px; font-size: 14px; font-weight: 500; }
.room-img-placeholder {
  background: #f9fafb; border-radius: var(--radius-sm); border: 2px dashed var(--border);
  display: flex; align-items: center; justify-content: center; min-height: 180px;
}
.special-req {
  background: #f9fafb; border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 10px 14px; font-size: 14px; margin-top: 6px; color: var(--text-2);
}

/* AVATAR */
.avatar-section { display: flex; justify-content: flex-start; margin-bottom: 16px; }
.avatar-big {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), #e8b84b);
  color: white; font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.avatar-big.emp { width: 72px; height: 72px; font-size: 22px; flex-shrink: 0; }

/* REVENUE */
.rev-filters { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; max-width: 600px; margin-bottom: 20px; }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  animation: fadeIn 0.15s;
}
.modal-box {
  background: var(--white); border-radius: var(--radius);
  padding: 24px; min-width: 340px; max-width: 92vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 700; font-size: 16px; margin-bottom: 16px;
}
.modal-header button { background: none; border: none; cursor: pointer; color: var(--text-2); display: flex; }

/* TOAST */
.toast {
  position: fixed; bottom: 24px; right: 24px; padding: 12px 20px;
  border-radius: var(--radius-sm); font-weight: 600; font-size: 14px;
  z-index: 200; animation: slideUp 0.2s ease;
}
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.toast-success { background: #22c55e; color: white; }
.toast-error { background: #ef4444; color: white; }

/* LOGIN */
.login-wrap {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.login-box {
  background: white; border-radius: 20px; padding: 40px 36px;
  width: 400px; max-width: 95vw; box-shadow: 0 24px 80px rgba(0,0,0,0.3);
}
.login-logo { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; }
.logo-text {
  font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700;
  color: var(--gold); letter-spacing: 3px; border: 2px solid var(--gold);
  padding: 4px 14px; line-height: 1.2;
}
.logo-sub { font-size: 10px; letter-spacing: 5px; color: var(--gold); margin-top: 4px; }
.login-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 24px; color: var(--text); }
.err-msg { color: #ef4444; font-size: 13px; margin-top: 4px; }
.login-hint { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 12px; }

/* LOADING */
.loading { display: flex; align-items: center; justify-content: center; height: 200px; color: var(--text-2); font-size: 16px; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

@media (max-width: 900px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .dash-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
  .rev-filters { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .room-grid { grid-template-columns: 1fr 1fr; }
}
`;