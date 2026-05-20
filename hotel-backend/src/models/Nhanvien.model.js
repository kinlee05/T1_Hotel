const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
  id_nguoidung:  { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung', required: true },
  ma_nhanvien:   { type: String, required: true, unique: true }, // E001, E002...
  ho_ten:        { type: String, required: true },
  email:         { type: String, required: true },
  sdt:           { type: String },
  vai_tro:       {
    type: String,
    enum: ['Manager', 'Receptionist', 'Housekeeping', 'Accountant', 'IT'],
    required: true
  },
  trang_thai:    { type: String, enum: ['active', 'inactive'], default: 'active' },
  // Account info
  ten_dang_nhap: { type: String, unique: true },
  lan_dang_nhap_cuoi: { type: Date },
  // Work info
  ngay_vao_lam:  { type: Date },
  phong_ban:     { type: String },
  ca_lam:        { type: String, enum: ['Morning', 'Afternoon', 'Night'], default: 'Morning' },
  luong:         { type: Number },
  avatar:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('NhanVien', nhanVienSchema);