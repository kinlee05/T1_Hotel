const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const DanhGia = require('./models/DanhGia.model');
const DichVu  = require('./models/DichVu.model');

const VaiTro    = require('./models/VaiTro.model');
const NguoiDung = require('./models/NguoiDung.model');
const NhanVien  = require('./models/NhanVien.model');
const KhachHang = require('./models/KhachHang.model');
const Phong     = require('./models/Phong.model');
const DatPhong  = require('./models/DatPhong.model');
const ThanhToan = require('./models/ThanhToan.model');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  await Promise.all([
    VaiTro.deleteMany(), NguoiDung.deleteMany(), NhanVien.deleteMany(),
    KhachHang.deleteMany(), Phong.deleteMany(), DatPhong.deleteMany(), ThanhToan.deleteMany(),
    DanhGia.deleteMany(), DichVu.deleteMany(),
  ]);
  console.log('Cleared old data');

  // ── Vai trò ──────────────────────────────────
  const vaiTros = await VaiTro.insertMany([
    { ten_vaitro: 'admin' }, { ten_vaitro: 'le_tan' }, { ten_vaitro: 'housekeeping' },
    { ten_vaitro: 'ke_toan' }, { ten_vaitro: 'it' }, { ten_vaitro: 'khach_hang' },
  ]);
  const vtAdmin        = vaiTros.find(v => v.ten_vaitro === 'admin');
  const vtLeTan        = vaiTros.find(v => v.ten_vaitro === 'le_tan');
  const vtHousekeeping = vaiTros.find(v => v.ten_vaitro === 'housekeeping');
  const vtIT           = vaiTros.find(v => v.ten_vaitro === 'it');
  console.log('Created vai tro');

  // ── Tài khoản ────────────────────────────────
  const nguoiDungs = await NguoiDung.insertMany([
    { ho_ten: 'Admin Hotel',  email: 'admin@hotel.com',  mat_khau: await bcrypt.hash('123456', 10), id_vaitro: vtAdmin._id },
    { ho_ten: 'John Smith',   email: 'john@hotel.com',   mat_khau: await bcrypt.hash('123456', 10), id_vaitro: vtAdmin._id },
    { ho_ten: 'Anna Lee',     email: 'anna@hotel.com',   mat_khau: await bcrypt.hash('123456', 10), id_vaitro: vtLeTan._id },
    { ho_ten: 'Mike Tran',    email: 'mike@hotel.com',   mat_khau: await bcrypt.hash('123456', 10), id_vaitro: vtHousekeeping._id },
    { ho_ten: 'Steve Nguyen', email: 'steve@hotel.com',  mat_khau: await bcrypt.hash('123456', 10), id_vaitro: vtLeTan._id },
    { ho_ten: 'Mary Pham',    email: 'mary@hotel.com',   mat_khau: await bcrypt.hash('123456', 10), id_vaitro: vtHousekeeping._id },
    { ho_ten: 'IT Manager',   email: 'it@hotel.com',     mat_khau: await bcrypt.hash('123456', 10), id_vaitro: vtIT._id },
  ]);
  console.log('Created nguoi dung');

  // ── Nhân viên ────────────────────────────────
  await NhanVien.insertMany([
    { id_nguoidung: nguoiDungs[1]._id, ma_nhanvien: 'E001', ho_ten: 'John Smith',   email: 'john@hotel.com',  sdt: '091283748',  vai_tro: 'Manager',      ten_dang_nhap: 'john.smith',   ngay_vao_lam: new Date('2023-01-10'), phong_ban: 'Front Office', ca_lam: 'Morning',   luong: 1200 },
    { id_nguoidung: nguoiDungs[2]._id, ma_nhanvien: 'E002', ho_ten: 'Anna Lee',     email: 'anna@hotel.com',  sdt: '0182930482', vai_tro: 'Housekeeping', ten_dang_nhap: 'anna.lee',     ngay_vao_lam: new Date('2023-03-15'), phong_ban: 'Housekeeping', ca_lam: 'Morning',   luong: 800  },
    { id_nguoidung: nguoiDungs[3]._id, ma_nhanvien: 'E003', ho_ten: 'Mike Tran',    email: 'mike@hotel.com',  sdt: '0748392812', vai_tro: 'Receptionist', ten_dang_nhap: 'mike.tran',    ngay_vao_lam: new Date('2023-06-01'), phong_ban: 'Front Office', ca_lam: 'Afternoon', luong: 900  },
    { id_nguoidung: nguoiDungs[4]._id, ma_nhanvien: 'E004', ho_ten: 'Steve Nguyen', email: 'steve@hotel.com', sdt: '0129384752', vai_tro: 'Housekeeping', ten_dang_nhap: 'steve.nguyen', ngay_vao_lam: new Date('2024-01-20'), phong_ban: 'Housekeeping', ca_lam: 'Morning',   luong: 800  },
    { id_nguoidung: nguoiDungs[5]._id, ma_nhanvien: 'E005', ho_ten: 'Mary Pham',    email: 'mary@hotel.com',  sdt: '0192837465', vai_tro: 'Receptionist', ten_dang_nhap: 'mary.pham',    ngay_vao_lam: new Date('2024-06-01'), phong_ban: 'Front Office', ca_lam: 'Night',     luong: 900  },
    { id_nguoidung: nguoiDungs[6]._id, ma_nhanvien: 'E006', ho_ten: 'IT Manager',   email: 'it@hotel.com',    sdt: '0999888777', vai_tro: 'IT',           ten_dang_nhap: 'it.manager',   ngay_vao_lam: new Date('2023-01-01'), phong_ban: 'IT',           ca_lam: 'Morning',   luong: 1500 },
  ]);
  console.log('Created nhan vien');

  // ── Phòng ────────────────────────────────────
  const phongs = await Phong.insertMany([
    { so_phong: '101', loai_phong: 'Standard', tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner', mo_ta: 'Spacious and comfortable room with balcony view.', trang_thai: 'occupied' },
    { so_phong: '102', loai_phong: 'Standard', tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner', trang_thai: 'available' },
    { so_phong: '103', loai_phong: 'Standard', tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner', trang_thai: 'available' },
    { so_phong: '104', loai_phong: 'Standard', tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner', trang_thai: 'maintenance' },
    { so_phong: '105', loai_phong: 'Standard', tang: 1, gia_moi_dem: 120, so_giuong: 2, dien_tich: 35, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner', trang_thai: 'available' },
    { so_phong: '201', loai_phong: 'Deluxe',   tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub', trang_thai: 'available' },
    { so_phong: '202', loai_phong: 'Deluxe',   tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub', trang_thai: 'available' },
    { so_phong: '205', loai_phong: 'Deluxe',   tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub', trang_thai: 'occupied' },
    { so_phong: '206', loai_phong: 'Deluxe',   tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub', trang_thai: 'occupied' },
    { so_phong: '208', loai_phong: 'Deluxe',   tang: 2, gia_moi_dem: 180, so_giuong: 2, dien_tich: 45, suc_chua: 3, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub', trang_thai: 'occupied' },
    { so_phong: '301', loai_phong: 'Suite',    tang: 3, gia_moi_dem: 300, so_giuong: 1, dien_tich: 70, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub, Kitchen', trang_thai: 'occupied' },
    { so_phong: '302', loai_phong: 'Suite',    tang: 3, gia_moi_dem: 300, so_giuong: 1, dien_tich: 70, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub, Kitchen', trang_thai: 'available' },
    { so_phong: '303', loai_phong: 'Suite',    tang: 3, gia_moi_dem: 300, so_giuong: 1, dien_tich: 70, suc_chua: 2, tien_nghi: 'Wifi, TV, Air Conditioner, Bathtub, Kitchen', trang_thai: 'occupied' },
  ]);
  console.log('Created phong');

  // ── Khách hàng ───────────────────────────────
  const khachHangs = await KhachHang.insertMany([
    { ma_khachhang: 'C001', ho_ten: 'John',      ten_hien_thi: 'JH', email: 'john@gmail.com',       sdt: '+84034729623', ngay_sinh: new Date('1984-03-17'), quoc_tich: 'British',    gioi_tinh: 'Male',   so_cmnd_passport: '123456789', dia_chi: '17 Grenoble Road', ghi_chu: 'VIP customer' },
    { ma_khachhang: 'C002', ho_ten: 'Anna',      ten_hien_thi: 'AN', email: 'anna@example.com',     sdt: '0182930482',   quoc_tich: 'American',   gioi_tinh: 'Female' },
    { ma_khachhang: 'C003', ho_ten: 'Mike',      ten_hien_thi: 'MK', email: 'mike@example.com',     sdt: '0748392812',   quoc_tich: 'Australian', gioi_tinh: 'Male' },
    { ma_khachhang: 'C004', ho_ten: 'Steve',     ten_hien_thi: 'ST', email: 'steve@example.com',    sdt: '0129384752',   quoc_tich: 'Canadian',   gioi_tinh: 'Male' },
    { ma_khachhang: 'C005', ho_ten: 'Mary',      ten_hien_thi: 'MR', email: 'mary@example.com',     sdt: '0192837465',   quoc_tich: 'French',     gioi_tinh: 'Female' },
    { ma_khachhang: 'C006', ho_ten: 'Josh',      ten_hien_thi: 'JS', email: 'josh@example.com',     sdt: '0493728592',   quoc_tich: 'German',     gioi_tinh: 'Male' },
    { ma_khachhang: 'C007', ho_ten: 'Angus',     ten_hien_thi: 'AG', email: 'angus@example.com',    sdt: '0394827618',   quoc_tich: 'British',    gioi_tinh: 'Male' },
    { ma_khachhang: 'C008', ho_ten: 'Catherine', ten_hien_thi: 'CT', email: 'catherine@example.com',sdt: '0392819402',   quoc_tich: 'Japanese',   gioi_tinh: 'Female' },
    { ma_khachhang: 'C009', ho_ten: 'Edgar',     ten_hien_thi: 'ED', email: 'ed@example.com',       sdt: '019283920',    quoc_tich: 'Korean',     gioi_tinh: 'Male' },
  ]);
  console.log('Created khach hang');

  // ── Đặt phòng ────────────────────────────────
  const p = (so) => phongs.find(p => p.so_phong === so);
  const kh = (i) => khachHangs[i]._id;

  const now = new Date();
  const mo = (n) => new Date(now.getFullYear(), now.getMonth() - n, 1); // n tháng trước

  const datPhongs = await DatPhong.insertMany([
    // Tháng hiện tại
    { ma_datphong: 'B001', id_khachhang: kh(0), id_phong: p('101')._id, ngay_checkin: new Date(now.getFullYear(), now.getMonth(), 1),  ngay_checkout: new Date(now.getFullYear(), now.getMonth(), 3),  tong_tien: 240, trang_thai: 'checked_in',  yeu_cau_dac_biet: 'High floor, non-smoking' },
    { ma_datphong: 'B002', id_khachhang: kh(1), id_phong: p('205')._id, ngay_checkin: new Date(now.getFullYear(), now.getMonth(), 5),  ngay_checkout: new Date(now.getFullYear(), now.getMonth(), 6),  tong_tien: 180, trang_thai: 'pending' },
    { ma_datphong: 'B003', id_khachhang: kh(2), id_phong: p('208')._id, ngay_checkin: new Date(now.getFullYear(), now.getMonth(), 7),  ngay_checkout: new Date(now.getFullYear(), now.getMonth(), 10), tong_tien: 540, trang_thai: 'confirmed' },
    { ma_datphong: 'B004', id_khachhang: kh(3), id_phong: p('301')._id, ngay_checkin: new Date(now.getFullYear(), now.getMonth(), 10), ngay_checkout: new Date(now.getFullYear(), now.getMonth(), 12), tong_tien: 600, trang_thai: 'confirmed' },
    { ma_datphong: 'B005', id_khachhang: kh(4), id_phong: p('303')._id, ngay_checkin: new Date(now.getFullYear(), now.getMonth(), 3),  ngay_checkout: new Date(now.getFullYear(), now.getMonth(), 4),  tong_tien: 300, trang_thai: 'cancelled' },
    { ma_datphong: 'B006', id_khachhang: kh(5), id_phong: p('206')._id, ngay_checkin: new Date(now.getFullYear(), now.getMonth(), 8),  ngay_checkout: new Date(now.getFullYear(), now.getMonth(), 9),  tong_tien: 180, trang_thai: 'pending' },
    // Tháng trước (1)
    { ma_datphong: 'B007', id_khachhang: kh(6), id_phong: p('102')._id, ngay_checkin: new Date(mo(1).getFullYear(), mo(1).getMonth(), 5),  ngay_checkout: new Date(mo(1).getFullYear(), mo(1).getMonth(), 8),  tong_tien: 360, trang_thai: 'checked_out' },
    { ma_datphong: 'B008', id_khachhang: kh(7), id_phong: p('301')._id, ngay_checkin: new Date(mo(1).getFullYear(), mo(1).getMonth(), 10), ngay_checkout: new Date(mo(1).getFullYear(), mo(1).getMonth(), 13), tong_tien: 900, trang_thai: 'checked_out' },
    { ma_datphong: 'B009', id_khachhang: kh(8), id_phong: p('201')._id, ngay_checkin: new Date(mo(1).getFullYear(), mo(1).getMonth(), 15), ngay_checkout: new Date(mo(1).getFullYear(), mo(1).getMonth(), 17), tong_tien: 360, trang_thai: 'checked_out' },
    { ma_datphong: 'B010', id_khachhang: kh(0), id_phong: p('303')._id, ngay_checkin: new Date(mo(1).getFullYear(), mo(1).getMonth(), 20), ngay_checkout: new Date(mo(1).getFullYear(), mo(1).getMonth(), 22), tong_tien: 600, trang_thai: 'checked_out' },
    // 2 tháng trước
    { ma_datphong: 'B011', id_khachhang: kh(1), id_phong: p('103')._id, ngay_checkin: new Date(mo(2).getFullYear(), mo(2).getMonth(), 3),  ngay_checkout: new Date(mo(2).getFullYear(), mo(2).getMonth(), 5),  tong_tien: 240, trang_thai: 'checked_out' },
    { ma_datphong: 'B012', id_khachhang: kh(2), id_phong: p('205')._id, ngay_checkin: new Date(mo(2).getFullYear(), mo(2).getMonth(), 8),  ngay_checkout: new Date(mo(2).getFullYear(), mo(2).getMonth(), 10), tong_tien: 360, trang_thai: 'checked_out' },
    { ma_datphong: 'B013', id_khachhang: kh(3), id_phong: p('302')._id, ngay_checkin: new Date(mo(2).getFullYear(), mo(2).getMonth(), 12), ngay_checkout: new Date(mo(2).getFullYear(), mo(2).getMonth(), 15), tong_tien: 900, trang_thai: 'checked_out' },
    { ma_datphong: 'B014', id_khachhang: kh(4), id_phong: p('101')._id, ngay_checkin: new Date(mo(2).getFullYear(), mo(2).getMonth(), 18), ngay_checkout: new Date(mo(2).getFullYear(), mo(2).getMonth(), 20), tong_tien: 240, trang_thai: 'checked_out' },
    // 3 tháng trước
    { ma_datphong: 'B015', id_khachhang: kh(5), id_phong: p('206')._id, ngay_checkin: new Date(mo(3).getFullYear(), mo(3).getMonth(), 2),  ngay_checkout: new Date(mo(3).getFullYear(), mo(3).getMonth(), 4),  tong_tien: 360, trang_thai: 'checked_out' },
    { ma_datphong: 'B016', id_khachhang: kh(6), id_phong: p('301')._id, ngay_checkin: new Date(mo(3).getFullYear(), mo(3).getMonth(), 7),  ngay_checkout: new Date(mo(3).getFullYear(), mo(3).getMonth(), 10), tong_tien: 900, trang_thai: 'checked_out' },
    { ma_datphong: 'B017', id_khachhang: kh(7), id_phong: p('102')._id, ngay_checkin: new Date(mo(3).getFullYear(), mo(3).getMonth(), 14), ngay_checkout: new Date(mo(3).getFullYear(), mo(3).getMonth(), 16), tong_tien: 240, trang_thai: 'checked_out' },
    // 4 tháng trước
    { ma_datphong: 'B018', id_khachhang: kh(8), id_phong: p('208')._id, ngay_checkin: new Date(mo(4).getFullYear(), mo(4).getMonth(), 5),  ngay_checkout: new Date(mo(4).getFullYear(), mo(4).getMonth(), 8),  tong_tien: 540, trang_thai: 'checked_out' },
    { ma_datphong: 'B019', id_khachhang: kh(0), id_phong: p('303')._id, ngay_checkin: new Date(mo(4).getFullYear(), mo(4).getMonth(), 10), ngay_checkout: new Date(mo(4).getFullYear(), mo(4).getMonth(), 12), tong_tien: 600, trang_thai: 'checked_out' },
    { ma_datphong: 'B020', id_khachhang: kh(1), id_phong: p('201')._id, ngay_checkin: new Date(mo(4).getFullYear(), mo(4).getMonth(), 16), ngay_checkout: new Date(mo(4).getFullYear(), mo(4).getMonth(), 18), tong_tien: 360, trang_thai: 'checked_out' },
    // 5 tháng trước
    { ma_datphong: 'B021', id_khachhang: kh(2), id_phong: p('105')._id, ngay_checkin: new Date(mo(5).getFullYear(), mo(5).getMonth(), 3),  ngay_checkout: new Date(mo(5).getFullYear(), mo(5).getMonth(), 5),  tong_tien: 240, trang_thai: 'checked_out' },
    { ma_datphong: 'B022', id_khachhang: kh(3), id_phong: p('302')._id, ngay_checkin: new Date(mo(5).getFullYear(), mo(5).getMonth(), 8),  ngay_checkout: new Date(mo(5).getFullYear(), mo(5).getMonth(), 11), tong_tien: 900, trang_thai: 'checked_out' },
    { ma_datphong: 'B023', id_khachhang: kh(4), id_phong: p('206')._id, ngay_checkin: new Date(mo(5).getFullYear(), mo(5).getMonth(), 13), ngay_checkout: new Date(mo(5).getFullYear(), mo(5).getMonth(), 14), tong_tien: 180, trang_thai: 'checked_out' },
  ]);
  console.log('Created dat phong');

  // ── Thanh toán (paid = hiện trên chart) ──────
  const tt = (i, so_tien, phuong_thuc, ngay) => ({
    id_datphong: datPhongs[i]._id, so_tien, phuong_thuc, trang_thai: 'paid', ngay_thanhtoan: ngay
  });

  await ThanhToan.insertMany([
    // Tháng hiện tại
    tt(0, 240, 'card',     new Date(now.getFullYear(), now.getMonth(), 1)),
    // Tháng trước
    tt(6,  360, 'card',     new Date(mo(1).getFullYear(), mo(1).getMonth(), 8)),
    tt(7,  900, 'transfer', new Date(mo(1).getFullYear(), mo(1).getMonth(), 13)),
    tt(8,  360, 'cash',     new Date(mo(1).getFullYear(), mo(1).getMonth(), 17)),
    tt(9,  600, 'card',     new Date(mo(1).getFullYear(), mo(1).getMonth(), 22)),
    // 2 tháng trước
    tt(10, 240, 'cash',     new Date(mo(2).getFullYear(), mo(2).getMonth(), 5)),
    tt(11, 360, 'card',     new Date(mo(2).getFullYear(), mo(2).getMonth(), 10)),
    tt(12, 900, 'transfer', new Date(mo(2).getFullYear(), mo(2).getMonth(), 15)),
    tt(13, 240, 'card',     new Date(mo(2).getFullYear(), mo(2).getMonth(), 20)),
    // 3 tháng trước
    tt(14, 360, 'cash',     new Date(mo(3).getFullYear(), mo(3).getMonth(), 4)),
    tt(15, 900, 'card',     new Date(mo(3).getFullYear(), mo(3).getMonth(), 10)),
    tt(16, 240, 'transfer', new Date(mo(3).getFullYear(), mo(3).getMonth(), 16)),
    // 4 tháng trước
    tt(17, 540, 'card',     new Date(mo(4).getFullYear(), mo(4).getMonth(), 8)),
    tt(18, 600, 'transfer', new Date(mo(4).getFullYear(), mo(4).getMonth(), 12)),
    tt(19, 360, 'cash',     new Date(mo(4).getFullYear(), mo(4).getMonth(), 18)),
    // 5 tháng trước
    tt(20, 240, 'card',     new Date(mo(5).getFullYear(), mo(5).getMonth(), 5)),
    tt(21, 900, 'transfer', new Date(mo(5).getFullYear(), mo(5).getMonth(), 11)),
    tt(22, 180, 'cash',     new Date(mo(5).getFullYear(), mo(5).getMonth(), 14)),
  ]);
  console.log('Created thanh toan');

  // ── Dịch vụ ──────────────────────────────────
await DichVu.insertMany([
  { ten_dichvu: 'Bữa sáng buffet',      gia: 250000, don_vi: 'người/ngày', loai: 'breakfast', icon: '☕', trang_thai: 'active' },
  { ten_dichvu: 'Xe đưa đón sân bay',   gia: 450000, don_vi: 'lượt',       loai: 'airport',   icon: '🚐', trang_thai: 'active' },
  { ten_dichvu: 'Gói Spa thư giãn',     gia: 800000, don_vi: 'người',      loai: 'spa',       icon: '💆', trang_thai: 'active' },
  { ten_dichvu: 'Bữa tối lãng mạn',    gia: 650000, don_vi: '2 người',    loai: 'other',     icon: '🍷', trang_thai: 'active' },
  { ten_dichvu: 'Giặt là',              gia: 100000, don_vi: 'kg',         loai: 'laundry',   icon: '👕', trang_thai: 'active' },
]);
console.log('Created dich vu');

// ── Đánh giá mẫu (chỉ cho các booking đã checked_out) ──
// datPhongs[6] = B007, datPhongs[7] = B008, datPhongs[8] = B009
await DanhGia.insertMany([
  { id_datphong: datPhongs[6]._id, id_khachhang: khachHangs[6]._id, id_phong: phongs.find(p => p.so_phong === '102')._id, diem_so: 5, noi_dung: 'Phòng rất sạch sẽ, nhân viên nhiệt tình!', trang_thai: 'approved' },
  { id_datphong: datPhongs[7]._id, id_khachhang: khachHangs[7]._id, id_phong: phongs.find(p => p.so_phong === '301')._id, diem_so: 4, noi_dung: 'View đẹp, bữa sáng ngon. Sẽ quay lại.', trang_thai: 'approved' },
  { id_datphong: datPhongs[8]._id, id_khachhang: khachHangs[8]._id, id_phong: phongs.find(p => p.so_phong === '201')._id, diem_so: 4, noi_dung: 'Dịch vụ tốt, giá hợp lý.', trang_thai: 'pending'  },
]);
console.log('Created danh gia');

  console.log('\n✅ Seed xong!');
  console.log('   Admin:  admin@hotel.com / 123456');
  console.log('   IT:     it@hotel.com    / 123456');
  console.log('   Lễ tân: anna@hotel.com  / 123456');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error('Seed lỗi:', err); process.exit(1); });