const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/NguoiDung.model');

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await NguoiDung.findById(decoded.id).populate('id_vaitro');
    if (!req.user) return res.status(401).json({ message: 'Người dùng không tồn tại' });
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};