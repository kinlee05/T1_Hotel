const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/NguoiDung.model');

const taoToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;
    if (!email || !mat_khau)
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

    // Tìm user kèm vai trò
    const nguoiDung = await NguoiDung.findOne({ email }).populate('id_vaitro');
    if (!nguoiDung)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    // Kiểm tra tài khoản còn active không
    if (nguoiDung.trang_thai === 'inactive')
      return res.status(403).json({ message: 'Tài khoản đã bị vô hiệu hóa' });

    // So sánh mật khẩu
    const hopLe = await nguoiDung.comparePassword(mat_khau);
    if (!hopLe)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const token = taoToken(nguoiDung._id);
    const vaiTro = nguoiDung.id_vaitro?.ten_vaitro;

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id:       nguoiDung._id,
        ho_ten:   nguoiDung.ho_ten,
        email:    nguoiDung.email,
        vai_tro:  vaiTro,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout  (client tự xóa token, server chỉ confirm)
exports.logout = (req, res) => {
  res.json({ message: 'Đăng xuất thành công' });
};

// GET /api/auth/me  (lấy thông tin user đang đăng nhập)
exports.getMe = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findById(req.user._id)
      .populate('id_vaitro', 'ten_vaitro')
      .select('-mat_khau');
    res.json(nguoiDung);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};