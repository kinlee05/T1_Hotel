const DatPhong = require('../models/DatPhong.model');
const Phong = require('../models/Phong.model');
const KhachHang = require('../models/KhachHang.model');
const ThanhToan = require('../models/ThanhToan.model');

// GET /api/admin/dat-phong
exports.danhSach = async (req, res) => {
  try {
    const { trang_thai, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (trang_thai) filter.trang_thai = trang_thai;
    if (search) {
      filter.$or = [
        { ma_datphong: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await DatPhong.countDocuments(filter);
    const data = await DatPhong.find(filter)
      .populate('id_khachhang', 'ho_ten email sdt')
      .populate('id_phong', 'so_phong loai_phong gia_moi_dem')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/dat-phong/:id
exports.chiTiet = async (req, res) => {
  try {
    const dp = await DatPhong.findById(req.params.id)
      .populate('id_khachhang', 'ho_ten email sdt quoc_tich')
      .populate('id_phong', 'so_phong loai_phong gia_moi_dem tang');

    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đặt phòng' });
    res.json(dp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/dat-phong
exports.taoMoi = async (req, res) => {
  try {
    const { id_khachhang, id_phong, ngay_checkin, ngay_checkout, yeu_cau_dac_biet } = req.body;

    // Kiểm tra phòng còn trống không
    const phong = await Phong.findById(id_phong);
    if (!phong) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    if (phong.trang_thai !== 'available') {
      return res.status(400).json({ message: 'Phòng không còn trống' });
    }

    // Tính tổng tiền
    const checkin = new Date(ngay_checkin);
    const checkout = new Date(ngay_checkout);
    const soNgay = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const tong_tien = soNgay * phong.gia_moi_dem;

    // Sinh mã đặt phòng
    const lastDP = await DatPhong.findOne().sort({ createdAt: -1 });
    let soThu = 1;
    if (lastDP?.ma_datphong) {
      soThu = parseInt(lastDP.ma_datphong.replace('B', '')) + 1;
    }
    const ma_datphong = `B${String(soThu).padStart(3, '0')}`;

    const dp = await DatPhong.create({
      ma_datphong, id_khachhang, id_phong,
      ngay_checkin, ngay_checkout,
      tong_tien, yeu_cau_dac_biet,
      trang_thai: 'pending',
    });

    res.status(201).json({ message: 'Tạo đặt phòng thành công', data: dp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/dat-phong/:id
exports.capNhat = async (req, res) => {
  try {
    const updated = await DatPhong.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('id_khachhang', 'ho_ten email sdt')
     .populate('id_phong', 'so_phong loai_phong');

    if (!updated) return res.status(404).json({ message: 'Không tìm thấy đặt phòng' });
    res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/dat-phong/:id/xac-nhan
exports.xacNhan = async (req, res) => {
  try {
    const dp = await DatPhong.findByIdAndUpdate(
      req.params.id,
      { trang_thai: 'confirmed' },
      { new: true }
    );
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đặt phòng' });
    res.json({ message: 'Xác nhận đặt phòng thành công', data: dp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/dat-phong/:id/huy
exports.huy = async (req, res) => {
  try {
    const dp = await DatPhong.findById(req.params.id);
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đặt phòng' });
    if (dp.trang_thai === 'checked_in') {
      return res.status(400).json({ message: 'Không thể hủy khi khách đã check-in' });
    }

    dp.trang_thai = 'cancelled';
    await dp.save();

    // Trả phòng về trạng thái available
    await Phong.findByIdAndUpdate(dp.id_phong, { trang_thai: 'available' });

    res.json({ message: 'Hủy đặt phòng thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// PATCH /api/admin/dat-phong/:id/checkin
exports.checkIn = async (req, res) => {
  try {
    const dp = await DatPhong.findById(req.params.id);
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đặt phòng' });
    if (dp.trang_thai !== 'confirmed')
      return res.status(400).json({ message: 'Đặt phòng chưa được xác nhận' });

    dp.trang_thai = 'checked_in';
    await dp.save();

    // Cập nhật trạng thái phòng → occupied
    await Phong.findByIdAndUpdate(dp.id_phong, { trang_thai: 'occupied' });

    res.json({ message: 'Check-in thành công', data: dp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/dat-phong/:id/checkout
exports.checkOut = async (req, res) => {
  try {
    const { phuong_thuc = 'cash' } = req.body;

    const dp = await DatPhong.findById(req.params.id);
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đặt phòng' });
    if (dp.trang_thai !== 'checked_in')
      return res.status(400).json({ message: 'Khách chưa check-in' });

    dp.trang_thai = 'checked_out';
    await dp.save();

    // Trả phòng về available
    await Phong.findByIdAndUpdate(dp.id_phong, { trang_thai: 'available' });

    // ← Tạo ThanhToan → đây là nơi lưu doanh thu thật
    const tt = await ThanhToan.create({
      id_datphong:    dp._id,
      so_tien:        dp.tong_tien,
      phuong_thuc,
      trang_thai:     'paid',
      ngay_thanhtoan: new Date(),
    });

    res.json({ message: 'Check-out thành công', data: dp, thanh_toan: tt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};