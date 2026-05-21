const KhachHang = require('../models/KhachHang.model');
const DatPhong = require('../models/DatPhong.model');

// GET /api/admin/khach-hang
exports.danhSach = async (req, res) => {
  try {
    const { search, trang_thai, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (trang_thai) filter.trang_thai = trang_thai;
    if (search) {
      filter.$or = [
        { ho_ten:        { $regex: search, $options: 'i' } },
        { email:         { $regex: search, $options: 'i' } },
        { sdt:           { $regex: search, $options: 'i' } },
        { ma_khachhang:  { $regex: search, $options: 'i' } },
      ];
    }

    const total = await KhachHang.countDocuments(filter);
    const data  = await KhachHang.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/khach-hang/:id
exports.chiTiet = async (req, res) => {
  try {
    const kh = await KhachHang.findById(req.params.id);
    if (!kh) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });

    const lichSu = await DatPhong.find({ id_khachhang: kh._id })
      .populate('id_phong', 'so_phong loai_phong')
      .sort({ ngay_checkin: -1 });

    res.json({ khach_hang: kh, lich_su_dat_phong: lichSu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/khach-hang
exports.taoMoi = async (req, res) => {
  try {
    const { ho_ten, email, sdt, ngay_sinh, quoc_tich, gioi_tinh, so_cmnd_passport, dia_chi, ghi_chu } = req.body;

    // Tự sinh mã khách hàng
    const lastKH = await KhachHang.findOne({ ma_khachhang: { $regex: /^C\d+$/ } }).sort({ ma_khachhang: -1 });
    let soThu = 1;
    if (lastKH?.ma_khachhang) {
      soThu = parseInt(lastKH.ma_khachhang.replace('C', '')) + 1;
    }
    const ma_khachhang = `C${String(soThu).padStart(3, '0')}`;

    const kh = await KhachHang.create({
      ma_khachhang, ho_ten, email, sdt,
      ngay_sinh, quoc_tich, gioi_tinh,
      so_cmnd_passport, dia_chi, ghi_chu,
    });

    res.status(201).json({ message: 'Tạo khách hàng thành công', data: kh });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/khach-hang/:id
exports.capNhat = async (req, res) => {
  try {
    const updated = await KhachHang.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/khach-hang/:id
exports.xoa = async (req, res) => {
  try {
    await KhachHang.findByIdAndUpdate(req.params.id, { trang_thai: 'inactive' });
res.json({ message: 'Đã vô hiệu hóa khách hàng' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};