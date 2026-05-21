const KhachHang = require('../models/KhachHang.model');
const DatPhong  = require('../models/DatPhong.model');
const ThanhToan = require('../models/ThanhToan.model');
const DanhGia   = require('../models/DanhGia.model');
const DichVu    = require('../models/DichVu.model');
const Phong     = require('../models/Phong.model');

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Lấy KhachHang từ NguoiDung đang login
const layKhachHang = async (userId) => {
  const kh = await KhachHang.findOne({ id_nguoidung: userId });
  if (!kh) throw new Error('Không tìm thấy thông tin khách hàng');
  return kh;
};

// ─── Profile ──────────────────────────────────────────────────────────────────

// GET /api/customer/profile
exports.getProfile = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);
    res.json(kh);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// PATCH /api/customer/profile
exports.updateProfile = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);

    // Chỉ cho phép sửa các trường không nhạy cảm
    const allowed = ['ho_ten', 'sdt', 'ngay_sinh', 'gioi_tinh', 'dia_chi', 'quoc_tich'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) kh[field] = req.body[field];
    });

    await kh.save();
    res.json({ message: 'Cập nhật thông tin thành công', data: kh });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Giỏ hàng (cart) ──────────────────────────────────────────────────────────
// Giỏ hàng lưu trong session/client, nhưng server cung cấp API kiểm tra phòng còn trống

// POST /api/customer/gio-hang/kiem-tra
// Kiểm tra phòng + dịch vụ trước khi đặt
exports.kiemTraGioHang = async (req, res) => {
  try {
    const { id_phong, ngay_checkin, ngay_checkout, so_khach, dich_vu_ids = [] } = req.body;

    // Kiểm tra phòng tồn tại
    const phong = await Phong.findById(id_phong);
    if (!phong) return res.status(404).json({ message: 'Không tìm thấy phòng' });

    // Kiểm tra sức chứa
    if (so_khach > phong.suc_chua)
      return res.status(400).json({ message: `Phòng chỉ chứa tối đa ${phong.suc_chua} khách` });

    // Kiểm tra phòng còn trống trong khoảng ngày
    const trungLich = await DatPhong.findOne({
      id_phong,
      trang_thai: { $in: ['confirmed', 'checked_in'] },
      $or: [
        { ngay_checkin: { $lt: new Date(ngay_checkout) }, ngay_checkout: { $gt: new Date(ngay_checkin) } }
      ]
    });
    if (trungLich)
      return res.status(400).json({ message: 'Phòng đã được đặt trong khoảng thời gian này' });

    // Tính tổng tiền
    const checkin  = new Date(ngay_checkin);
    const checkout = new Date(ngay_checkout);
    const soNgay   = Math.ceil((checkout - checkin) / 86400000);
    if (soNgay <= 0)
      return res.status(400).json({ message: 'Ngày check-out phải sau ngày check-in' });

    const tienPhong = soNgay * phong.gia_moi_dem;

    // Tính tiền dịch vụ
    let tienDichVu = 0;
    let danhSachDV = [];
    if (dich_vu_ids.length > 0) {
      danhSachDV = await DichVu.find({ _id: { $in: dich_vu_ids }, trang_thai: 'active' });
      tienDichVu = danhSachDV.reduce((s, dv) => s + dv.gia, 0);
    }

    res.json({
      phong,
      so_ngay:     soNgay,
      tien_phong:  tienPhong,
      dich_vu:     danhSachDV,
      tien_dich_vu: tienDichVu,
      tong_tien:   tienPhong + tienDichVu,
      co_the_dat:  true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Đặt phòng ────────────────────────────────────────────────────────────────

// POST /api/customer/dat-phong
exports.datPhong = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);
    const {
      id_phong, ngay_checkin, ngay_checkout,
      so_khach, yeu_cau_dac_biet,
      dich_vu_ids = [], ma_giam_gia,
    } = req.body;

    // Validate phòng
    const phong = await Phong.findById(id_phong);
    if (!phong) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    if (phong.trang_thai !== 'available')
      return res.status(400).json({ message: 'Phòng không còn trống' });

    // Kiểm tra trùng lịch
    const trungLich = await DatPhong.findOne({
      id_phong,
      trang_thai: { $in: ['confirmed', 'checked_in'] },
      $or: [
        { ngay_checkin: { $lt: new Date(ngay_checkout) }, ngay_checkout: { $gt: new Date(ngay_checkin) } }
      ]
    });
    if (trungLich)
      return res.status(400).json({ message: 'Phòng đã được đặt trong khoảng thời gian này' });

    // Tính tiền
    const soNgay    = Math.ceil((new Date(ngay_checkout) - new Date(ngay_checkin)) / 86400000);
    let tienPhong   = soNgay * phong.gia_moi_dem;
    let tienDichVu  = 0;

    if (dich_vu_ids.length > 0) {
      const dvs = await DichVu.find({ _id: { $in: dich_vu_ids }, trang_thai: 'active' });
      tienDichVu = dvs.reduce((s, dv) => s + dv.gia, 0);
    }

    // Áp mã giảm giá (nếu có — dùng bảng PROMO_CODES đơn giản)
    const PROMO = { 'LUXURY20': 20, 'SUMMER10': 10, 'VIP30': 30 };
    let phanTramGiam = 0;
    if (ma_giam_gia && PROMO[ma_giam_gia]) {
      phanTramGiam = PROMO[ma_giam_gia];
    }
    const tienGiam  = Math.round((tienPhong + tienDichVu) * phanTramGiam / 100);
    const tong_tien = tienPhong + tienDichVu - tienGiam;

    // Sinh mã đặt phòng
    const lastDP = await DatPhong.findOne().sort({ createdAt: -1 });
    let soThu = 1;
    if (lastDP?.ma_datphong) soThu = parseInt(lastDP.ma_datphong.replace('B', '')) + 1;
    const ma_datphong = `B${String(soThu).padStart(3, '0')}`;

    const dp = await DatPhong.create({
      ma_datphong,
      id_khachhang: kh._id,
      id_phong,
      ngay_checkin,
      ngay_checkout,
      so_khach,
      tong_tien,
      yeu_cau_dac_biet,
      trang_thai: 'pending',
      // Lưu thêm metadata dịch vụ + giảm giá
      ghi_chu: JSON.stringify({ dich_vu_ids, ma_giam_gia, phan_tram_giam: phanTramGiam }),
    });

    res.status(201).json({
      message: 'Đặt phòng thành công! Vui lòng thanh toán để xác nhận.',
      data: dp,
      chi_tiet: { tien_phong: tienPhong, tien_dich_vu: tienDichVu, tien_giam: tienGiam, tong_tien },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/customer/don-hang
exports.danhSachDonHang = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);
    const { trang_thai, page = 1, limit = 10 } = req.query;

    const filter = { id_khachhang: kh._id };
    if (trang_thai) filter.trang_thai = trang_thai;

    const total = await DatPhong.countDocuments(filter);
    const data  = await DatPhong.find(filter)
      .populate('id_phong', 'so_phong loai_phong gia_moi_dem hinh_anh')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/customer/don-hang/:id
exports.chiTietDonHang = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);

    const dp = await DatPhong.findOne({ _id: req.params.id, id_khachhang: kh._id })
      .populate('id_phong');
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    // Kèm thông tin thanh toán nếu có
    const tt = await ThanhToan.findOne({ id_datphong: dp._id });

    res.json({ don_hang: dp, thanh_toan: tt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/customer/don-hang/:id/huy
exports.huyDonHang = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);

    const dp = await DatPhong.findOne({ _id: req.params.id, id_khachhang: kh._id });
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (!['pending', 'confirmed'].includes(dp.trang_thai))
      return res.status(400).json({ message: 'Không thể hủy đơn ở trạng thái này' });

    dp.trang_thai = 'cancelled';
    await dp.save();

    res.json({ message: 'Hủy đơn hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Thanh toán ───────────────────────────────────────────────────────────────

// POST /api/customer/thanh-toan
exports.thanhToan = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);
    const { id_datphong, phuong_thuc = 'card' } = req.body;

    // Verify đơn thuộc về khách hàng này
    const dp = await DatPhong.findOne({ _id: id_datphong, id_khachhang: kh._id });
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (dp.trang_thai === 'cancelled')
      return res.status(400).json({ message: 'Đơn hàng đã bị hủy' });

    // Kiểm tra chưa thanh toán
    const ttCu = await ThanhToan.findOne({ id_datphong: dp._id, trang_thai: 'paid' });
    if (ttCu) return res.status(400).json({ message: 'Đơn hàng đã được thanh toán' });

    // Tạo bản ghi thanh toán
    const tt = await ThanhToan.create({
      id_datphong: dp._id,
      so_tien:     dp.tong_tien,
      phuong_thuc,
      trang_thai:  'paid',
      ngay_thanhtoan: new Date(),
    });

    // Cập nhật trạng thái đặt phòng → confirmed
    dp.trang_thai = 'confirmed';
    await dp.save();

    res.status(201).json({
      message: 'Thanh toán thành công',
      thanh_toan: tt,
      don_hang:   dp,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/customer/hoa-don/:id_datphong
exports.xemHoaDon = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);

    const dp = await DatPhong.findOne({ _id: req.params.id_datphong, id_khachhang: kh._id })
      .populate('id_phong', 'so_phong loai_phong gia_moi_dem');
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const tt = await ThanhToan.findOne({ id_datphong: dp._id });
    if (!tt) return res.status(404).json({ message: 'Chưa có thông tin thanh toán' });

    res.json({ hoa_don: tt, don_hang: dp, khach_hang: kh });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Đánh giá ─────────────────────────────────────────────────────────────────

// POST /api/customer/danh-gia
exports.taoMoiDanhGia = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);
    const { id_datphong, diem_so, noi_dung, an_danh = false } = req.body;

    // Verify đơn thuộc khách hàng này và đã checkout
    const dp = await DatPhong.findOne({ _id: id_datphong, id_khachhang: kh._id });
    if (!dp) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (dp.trang_thai !== 'checked_out')
      return res.status(400).json({ message: 'Chỉ đánh giá được sau khi check-out' });

    // Kiểm tra đã đánh giá chưa
    const daDanhGia = await DanhGia.findOne({ id_datphong: dp._id });
    if (daDanhGia)
      return res.status(400).json({ message: 'Bạn đã đánh giá đơn hàng này rồi' });

    const dg = await DanhGia.create({
      id_datphong: dp._id,
      id_khachhang: kh._id,
      id_phong: dp.id_phong,
      diem_so, noi_dung, an_danh,
      trang_thai: 'pending', // chờ admin duyệt
    });

    res.status(201).json({ message: 'Gửi đánh giá thành công! Đang chờ duyệt.', data: dg });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Bạn đã đánh giá đơn hàng này rồi' });
    res.status(500).json({ message: err.message });
  }
};

// GET /api/customer/danh-gia
exports.danhSachDanhGia = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);

    const data = await DanhGia.find({ id_khachhang: kh._id })
      .populate('id_phong', 'so_phong loai_phong')
      .populate('id_datphong', 'ma_datphong ngay_checkin ngay_checkout')
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Lịch sử ──────────────────────────────────────────────────────────────────

// GET /api/customer/lich-su
// Trả về toàn bộ: đơn hàng + đánh giá + thanh toán
exports.lichSu = async (req, res) => {
  try {
    const kh = await layKhachHang(req.user._id);

    const donHangs = await DatPhong.find({ id_khachhang: kh._id })
      .populate('id_phong', 'so_phong loai_phong hinh_anh')
      .sort({ createdAt: -1 });

    // Kèm thanh toán và đánh giá theo từng đơn
    const result = await Promise.all(donHangs.map(async (dp) => {
      const [tt, dg] = await Promise.all([
        ThanhToan.findOne({ id_datphong: dp._id }),
        DanhGia.findOne({ id_datphong: dp._id }),
      ]);
      return {
        don_hang:   dp,
        thanh_toan: tt,
        danh_gia:   dg,
      };
    }));

    // Thống kê nhanh
    const tongDonHang  = donHangs.length;
    const tongChiTieu  = result
      .filter(r => r.thanh_toan?.trang_thai === 'paid')
      .reduce((s, r) => s + r.thanh_toan.so_tien, 0);

    res.json({
      lich_su: result,
      thong_ke: {
        tong_don_hang: tongDonHang,
        tong_chi_tieu: tongChiTieu,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};