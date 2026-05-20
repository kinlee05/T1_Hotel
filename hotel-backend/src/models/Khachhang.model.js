const mongoose = require('mongoose');

const khachHangSchema = new mongoose.Schema({
  id_nguoidung:   { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung' },
  ma_khachhang:   { type: String, unique: true }, // C001, C002...
  ho_ten:         { type: String, required: true },
  ten_hien_thi:   { type: String }, // display name / initials
  email:          { type: String },
  sdt:            { type: String },
  ngay_sinh:      { type: Date },
  quoc_tich:      { type: String },
  gioi_tinh:      { type: String, enum: ['Male', 'Female', 'Other'] },
  so_cmnd_passport: { type: String },
  dia_chi:        { type: String },
  ghi_chu:        { type: String }, // VIP notes, special requests
  trang_thai:     { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('KhachHang', khachHangSchema);