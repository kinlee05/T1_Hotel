const Phong = require('../models/Phong.model');
const DatPhong = require('../models/DatPhong.model');

// GET /api/admin/phong
exports.danhSach = async (req, res) => {
  try {
    const { trang_thai, loai_phong, tang, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (trang_thai) filter.trang_thai = trang_thai;
    if (loai_phong) filter.loai_phong = loai_phong;
    if (tang) filter.tang = Number(tang);
    if (search) {
      filter.$or = [
        { so_phong: { $regex: search, $options: 'i' } },
        { loai_phong: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Phong.countDocuments(filter);
    const data = await Phong.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ so_phong: 1 });

    res.json({ total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/phong/:id
exports.chiTiet = async (req, res) => {
  try {
    const phong = await Phong.findById(req.params.id);
    if (!phong) return res.status(404).json({ message: 'Không tìm thấy phòng' });

    // Lịch sử đặt phòng của phòng này
    const lichSu = await DatPhong.find({ id_phong: phong._id })
      .populate('id_khachhang', 'ho_ten email sdt')
      .sort({ ngay_checkin: -1 })
      .limit(20);

    res.json({ phong, lich_su_dat_phong: lichSu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/phong
exports.taoMoi = async (req, res) => {
  try {
    const { so_phong, loai_phong, tang, gia_moi_dem, so_giuong, dien_tich, suc_chua, tien_nghi, mo_ta, hinh_anh } = req.body;

    const phong = await Phong.create({
      so_phong, loai_phong, tang, gia_moi_dem,
      so_giuong, dien_tich, suc_chua, tien_nghi, mo_ta, hinh_anh,
      trang_thai: 'available',
    });

    res.status(201).json({ message: 'Tạo phòng thành công', data: phong });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Số phòng đã tồn tại' });
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/phong/:id
exports.capNhat = async (req, res) => {
  try {
    const updated = await Phong.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/phong/:id
exports.xoa = async (req, res) => {
  try {
    // Kiểm tra phòng có đang được đặt không
    const dangDat = await DatPhong.findOne({
      id_phong: req.params.id,
      trang_thai: { $in: ['confirmed', 'checked_in'] }
    });
    if (dangDat) return res.status(400).json({ message: 'Không thể xóa phòng đang được sử dụng' });

    await Phong.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa phòng thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/phong/:id/trang-thai
exports.capNhatTrangThai = async (req, res) => {
  try {
    const { trang_thai } = req.body;
    const updated = await Phong.findByIdAndUpdate(
      req.params.id,
      { trang_thai },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json({ message: 'Cập nhật trạng thái thành công', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};