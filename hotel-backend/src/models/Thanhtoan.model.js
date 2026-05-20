const mongoose = require('mongoose');

const thanhToanSchema = new mongoose.Schema({
  id_datphong:    { type: mongoose.Schema.Types.ObjectId, ref: 'DatPhong', required: true },
  so_tien:        { type: Number, required: true },
  phuong_thuc:    { type: String, enum: ['cash', 'card', 'transfer'], default: 'cash' },
  trang_thai:     { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  ngay_thanhtoan: { type: Date, default: Date.now },
  ghi_chu:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ThanhToan', thanhToanSchema);