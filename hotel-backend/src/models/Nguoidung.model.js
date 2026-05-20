const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const nguoiDungSchema = new mongoose.Schema({
  ho_ten:     { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  sdt:        { type: String },
  mat_khau:   { type: String, required: true },
  id_vaitro:  { type: mongoose.Schema.Types.ObjectId, ref: 'VaiTro', required: true },
  trang_thai: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

nguoiDungSchema.pre('save', async function (next) {
  if (!this.isModified('mat_khau')) return next();
  this.mat_khau = await bcrypt.hash(this.mat_khau, 10);
  next();
});

nguoiDungSchema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.mat_khau);
};

module.exports = mongoose.model('NguoiDung', nguoiDungSchema);