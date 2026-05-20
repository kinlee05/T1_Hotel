const NhanVien = require('../models/NhanVien.model');
const NguoiDung = require('../models/NguoiDung.model');
const VaiTro = require('../models/VaiTro.model');
const bcrypt = require('bcryptjs');

// GET /api/admin/nhan-vien
exports.danhSach = async (req, res) => {
  try {
    const { vai_tro, trang_thai, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (trang_thai) filter.trang_thai = trang_thai;
    if (vai_tro) filter.vai_tro = vai_tro;
    if (search) {
      filter.$or = [
        { ho_ten: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { ma_nhanvien: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await NhanVien.countDocuments(filter);
    const data = await NhanVien.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ total, page: Number(page), limit: Number(limit), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/nhan-vien/:id
exports.chiTiet = async (req, res) => {
  try {
    const nv = await NhanVien.findById(req.params.id);
    if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(nv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/nhan-vien
exports.taoMoi = async (req, res) => {
  try {
    const {
      ma_nhanvien, ho_ten, email, sdt, vai_tro,
      ten_dang_nhap, mat_khau,
      ngay_vao_lam, phong_ban, ca_lam, luong,
      trang_thai
    } = req.body;

    // Tạo tài khoản NguoiDung kèm vai trò
    const vaiTroMap = {
      'Manager': 'admin',
      'Receptionist': 'le_tan',
      'Housekeeping': 'housekeeping',
      'Accountant': 'ke_toan',
      'IT': 'it',
    };
    const tenVaiTro = vaiTroMap[vai_tro] || 'le_tan';
    const vt = await VaiTro.findOne({ ten_vaitro: tenVaiTro });
    if (!vt) return res.status(400).json({ message: 'Vai trò không tồn tại' });

    const nguoiDung = await NguoiDung.create({
      ho_ten, email, sdt,
      mat_khau,
      id_vaitro: vt._id,
    });

    const nv = await NhanVien.create({
      id_nguoidung: nguoiDung._id,
      ma_nhanvien, ho_ten, email, sdt, vai_tro,
      ten_dang_nhap, trang_thai,
      ngay_vao_lam, phong_ban, ca_lam, luong,
    });

    res.status(201).json({ message: 'Tạo nhân viên thành công', data: nv });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Mã nhân viên hoặc email đã tồn tại' });
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/nhan-vien/:id
exports.capNhat = async (req, res) => {
  try {
    const updated = await NhanVien.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/nhan-vien/:id  (soft delete)
exports.xoa = async (req, res) => {
  try {
    const nv = await NhanVien.findByIdAndUpdate(
      req.params.id,
      { trang_thai: 'inactive' },
      { new: true }
    );
    if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

    // Cũng vô hiệu hóa tài khoản đăng nhập
    await NguoiDung.findByIdAndUpdate(nv.id_nguoidung, { trang_thai: 'inactive' });

    res.json({ message: 'Đã vô hiệu hóa nhân viên' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/nhan-vien/:id/reset-mat-khau
exports.resetMatKhau = async (req, res) => {
  try {
    const { mat_khau_moi } = req.body;
    if (!mat_khau_moi) return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu mới' });

    const nv = await NhanVien.findById(req.params.id);
    if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

    const nguoiDung = await NguoiDung.findById(nv.id_nguoidung);
    if (!nguoiDung) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    nguoiDung.mat_khau = mat_khau_moi;
    await nguoiDung.save(); // pre-save hook sẽ hash

    res.json({ message: 'Reset mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/nhan-vien/:id/phan-quyen
exports.phanQuyen = async (req, res) => {
  try {
    const { vai_tro } = req.body;

    const nv = await NhanVien.findByIdAndUpdate(
      req.params.id,
      { vai_tro },
      { new: true }
    );
    if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

    res.json({ message: 'Cập nhật vai trò thành công', data: nv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};