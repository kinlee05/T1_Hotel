const mongoose = require('mongoose');

const danhGiaSchema = new mongoose.Schema({
  id_datphong:  { type: mongoose.Schema.Types.ObjectId, ref: 'DatPhong', required: true },
  id_khachhang: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  id_phong:     { type: mongoose.Schema.Types.ObjectId, ref: 'Phong', required: true },
  diem_so:      { type: Number, required: true, min: 1, max: 5 },
  noi_dung:     { type: String, required: true },
  phan_hoi:     { type: String, default: null }, // admin/lễ tân reply
  an_danh:      { type: Boolean, default: false },
  trang_thai:   { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Mỗi booking chỉ được đánh giá 1 lần
danhGiaSchema.index({ id_datphong: 1 }, { unique: true });

module.exports = mongoose.model('DanhGia', danhGiaSchema);