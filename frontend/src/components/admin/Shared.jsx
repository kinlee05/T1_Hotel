import { useState } from "react";
import { X, Check } from "lucide-react";

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


export { MOCK, STATUS_MAP, Modal, Confirm, Badge };