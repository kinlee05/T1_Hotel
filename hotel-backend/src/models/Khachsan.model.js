const mongoose = require('mongoose');

const khachSanSchema = new mongoose.Schema({
  ten:         { type: String, required: true },
  dia_chi:     { type: String },
  sdt:         { type: String },
  email:       { type: String },
  mo_ta:       { type: String },
  trang_thai:  { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('KhachSan', khachSanSchema);