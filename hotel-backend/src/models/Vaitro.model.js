const mongoose = require('mongoose');

const vaiTroSchema = new mongoose.Schema({
  ten_vaitro: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'le_tan', 'housekeeping', 'ke_toan', 'it', 'khach_hang']
  }
}, { timestamps: true });

module.exports = mongoose.model('VaiTro', vaiTroSchema);