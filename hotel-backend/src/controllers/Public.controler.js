const Phong   = require('../models/Phong.model');
const DichVu  = require('../models/DichVu.model');
const DanhGia = require('../models/DanhGia.model');

// GET /api/public/phong
// Query: loai_phong, so_khach, gia_min, gia_max, ngay_checkin, ngay_checkout, page, limit
exports.danhSachPhong = async (req, res) => {
  try {
    const {
      loai_phong, so_khach,
      gia_min, gia_max,
      ngay_checkin, ngay_checkout,
      page = 1, limit = 12,
    } = req.query;

    const filter = { trang_thai: 'available' };

    if (loai_phong && loai_phong !== 'all') filter.loai_phong = loai_phong;
    if (so_khach) filter.suc_chua = { $gte: Number(so_khach) };
    if (gia_min || gia_max) {
      filter.gia_moi_dem = {};
      if (gia_min) filter.gia_moi_dem.$gte = Number(gia_min);
      if (gia_max) filter.gia_moi_dem.$lte = Number(gia_max);
    }

    // Nếu có ngày check-in/out, lọc phòng chưa bị đặt trong khoảng đó
    if (ngay_checkin && ngay_checkout) {
      const DatPhong = require('../models/DatPhong.model');
      const phongBanBan = await DatPhong.find({
        trang_thai: { $in: ['confirmed', 'checked_in'] },
        $or: [
          { ngay_checkin: { $lt: new Date(ngay_checkout) }, ngay_checkout: { $gt: new Date(ngay_checkin) } }
        ]
      }).distinct('id_phong');

      filter._id = { $nin: phongBanBan };
    }

    const total = await Phong.countDocuments(filter);
    const data  = await Phong.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ loai_phong: 1, so_phong: 1 });

    res.json({ total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/public/phong/:id
exports.chiTietPhong = async (req, res) => {
  try {
    const phong = await Phong.findById(req.params.id);
    if (!phong) return res.status(404).json({ message: 'Không tìm thấy phòng' });

    // Lấy đánh giá đã duyệt của phòng này
    const danhGia = await DanhGia.find({ id_phong: phong._id, trang_thai: 'approved' })
      .populate({ path: 'id_khachhang', select: 'ho_ten ten_hien_thi' })
      .sort({ createdAt: -1 })
      .limit(10);

    // Tính điểm trung bình
    const diemTB = danhGia.length
      ? (danhGia.reduce((s, d) => s + d.diem_so, 0) / danhGia.length).toFixed(1)
      : null;

    res.json({ phong, danh_gia: danhGia, diem_trung_binh: Number(diemTB) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/public/dich-vu
exports.danhSachDichVu = async (req, res) => {
  try {
    const data = await DichVu.find({ trang_thai: 'active' }).sort({ loai: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};