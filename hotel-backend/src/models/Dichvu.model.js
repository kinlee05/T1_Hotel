const mongoose = require('mongoose');

const dichVuSchema = new mongoose.Schema({
  ten_dichvu:  { type: String, required: true },
  mo_ta:       { type: String },
  gia:         { type: Number, required: true },
  don_vi:      { type: String, default: 'lần' }, // lần, người, ngày...
  loai:        {
    type: String,
    enum: ['breakfast', 'airport', 'spa', 'laundry', 'other'],
    default: 'other'
  },
  icon:        { type: String }, // emoji hoặc URL
  trang_thai:  { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('DichVu', dichVuSchema);