const jwt = require('jsonwebtoken');
const NguoiDung = require('../models/NguoiDung.model');
const KhachHang = require('../models/KhachHang.model');
const VaiTro    = require('../models/VaiTro.model');

const taoToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { ho_ten, email, mat_khau, sdt, ngay_sinh, gioi_tinh, dia_chi } = req.body;

    if (!ho_ten || !email || !mat_khau)
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin bắt buộc' });

    // Kiểm tra email đã tồn tại chưa
    const existed = await NguoiDung.findOne({ email });
    if (existed)
      return res.status(400).json({ message: 'Email đã được sử dụng' });

    // Tìm vai trò khách hàng
    const vaiTroKH = await VaiTro.findOne({ ten_vaitro: 'khach_hang' });
    if (!vaiTroKH)
      return res.status(500).json({ message: 'Hệ thống chưa cấu hình vai trò' });

    // Tạo tài khoản NguoiDung
    const nguoiDung = await NguoiDung.create({
      ho_ten, email, sdt, mat_khau,
      id_vaitro: vaiTroKH._id,
    });

    // Tự sinh mã khách hàng
    const lastKH = await KhachHang.findOne().sort({ createdAt: -1 });
    let soThu = 1;
    if (lastKH?.ma_khachhang) {
      soThu = parseInt(lastKH.ma_khachhang.replace('C', '')) + 1;
    }
    const ma_khachhang = `C${String(soThu).padStart(3, '0')}`;

    // Tạo profile KhachHang liên kết
    const khachHang = await KhachHang.create({
      id_nguoidung: nguoiDung._id,
      ma_khachhang,
      ho_ten, email, sdt,
      ngay_sinh, gioi_tinh, dia_chi,
    });

    const token = taoToken(nguoiDung._id);

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id:      nguoiDung._id,
        ho_ten:  nguoiDung.ho_ten,
        email:   nguoiDung.email,
        vai_tro: 'khach_hang',
        khach_hang_id: khachHang._id,
      },
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Email đã tồn tại' });
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;
    if (!email || !mat_khau)
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

    const nguoiDung = await NguoiDung.findOne({ email }).populate('id_vaitro');
    if (!nguoiDung)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    if (nguoiDung.trang_thai === 'inactive')
      return res.status(403).json({ message: 'Tài khoản đã bị vô hiệu hóa' });

    const hopLe = await nguoiDung.comparePassword(mat_khau);
    if (!hopLe)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const token   = taoToken(nguoiDung._id);
    const vaiTro  = nguoiDung.id_vaitro?.ten_vaitro;

    // Nếu là khách hàng, kèm thêm khach_hang_id
    let khachHangId = null;
    if (vaiTro === 'khach_hang') {
      const kh = await KhachHang.findOne({ id_nguoidung: nguoiDung._id }).select('_id');
      khachHangId = kh?._id || null;
    }

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id:            nguoiDung._id,
        ho_ten:        nguoiDung.ho_ten,
        email:         nguoiDung.email,
        vai_tro:       vaiTro,
        khach_hang_id: khachHangId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.json({ message: 'Đăng xuất thành công' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findById(req.user._id)
      .populate('id_vaitro', 'ten_vaitro')
      .select('-mat_khau');

    // Kèm profile KhachHang nếu là customer
    let profile = null;
    if (nguoiDung.id_vaitro?.ten_vaitro === 'khach_hang') {
      profile = await KhachHang.findOne({ id_nguoidung: nguoiDung._id });
    }

    res.json({ ...nguoiDung.toObject(), profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { mat_khau_cu, mat_khau_moi } = req.body;

    if (!mat_khau_cu || !mat_khau_moi)
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });

    if (mat_khau_moi.length < 6)
      return res.status(400).json({ message: 'Mật khẩu mới phải ít nhất 6 ký tự' });

    const nguoiDung = await NguoiDung.findById(req.user._id);
    const hopLe = await nguoiDung.comparePassword(mat_khau_cu);
    if (!hopLe)
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });

    nguoiDung.mat_khau = mat_khau_moi;
    await nguoiDung.save(); // pre-save hook tự hash

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};