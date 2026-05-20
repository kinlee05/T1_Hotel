const mongoose = require('mongoose');

const phongSchema = new mongoose.Schema({
  so_phong:      { type: String, required: true, unique: true }, // 101, 102...
  loai_phong:    { type: String, enum: ['Standard', 'Deluxe', 'Suite'], required: true },
  tang:          { type: Number, required: true },
  gia_moi_dem:   { type: Number, required: true },
  so_giuong:     { type: Number, default: 1 },
  dien_tich:     { type: Number }, // m2
  suc_chua:      { type: Number, default: 2 }, // số khách
  tien_nghi:     { type: String }, // "Wifi, TV, Air Conditioner"
  mo_ta:         { type: String },
  hinh_anh:      { type: String },
  trang_thai:    {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
}, { timestamps: true });

module.exports = mongoose.model('Phong', phongSchema);