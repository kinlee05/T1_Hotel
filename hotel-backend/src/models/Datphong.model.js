const mongoose = require('mongoose');

const datPhongSchema = new mongoose.Schema({
  ma_datphong:    { type: String, required: true, unique: true }, // B001, B002...
  id_khachhang:   { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  id_phong:       { type: mongoose.Schema.Types.ObjectId, ref: 'Phong', required: true },
  ngay_checkin:   { type: Date, required: true },
  ngay_checkout:  { type: Date, required: true },
  tong_tien:      { type: Number },
  trang_thai:     {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
    default: 'pending'
  },
  yeu_cau_dac_biet: { type: String }, // special request
  ghi_chu:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('DatPhong', datPhongSchema);