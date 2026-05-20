const Phong = require('../models/Phong.model');
const DatPhong = require('../models/DatPhong.model');
const KhachHang = require('../models/KhachHang.model');
const ThanhToan = require('../models/ThanhToan.model');

// GET /api/admin/dashboard
exports.dashboard = async (req, res) => {
  try {
    // Thống kê phòng
    const tongPhong = await Phong.countDocuments();
    const phongTrong = await Phong.countDocuments({ trang_thai: 'available' });
    const phongDangO = await Phong.countDocuments({ trang_thai: 'occupied' });
    const phongBaoDuong = await Phong.countDocuments({ trang_thai: 'maintenance' });

    // Thống kê đặt phòng
    const tongDatPhong = await DatPhong.countDocuments();
    const datPhongTheoTrangThai = await DatPhong.aggregate([
      { $group: { _id: '$trang_thai', so_luong: { $sum: 1 } } }
    ]);

    // Tổng doanh thu (từ thanh toán đã paid)
    const doanhThuResult = await ThanhToan.aggregate([
      { $match: { trang_thai: 'paid' } },
      { $group: { _id: null, tong: { $sum: '$so_tien' } } }
    ]);
    const tongDoanhThu = doanhThuResult[0]?.tong || 0;

    // Đặt phòng gần đây (10 cái mới nhất)
    const datPhongGanDay = await DatPhong.find()
      .populate('id_khachhang', 'ho_ten')
      .populate('id_phong', 'so_phong loai_phong')
      .sort({ createdAt: -1 })
      .limit(10);

    // Doanh thu theo tháng (6 tháng gần nhất)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const doanhThuTheoThang = await ThanhToan.aggregate([
      { $match: { trang_thai: 'paid', ngay_thanhtoan: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { thang: { $month: '$ngay_thanhtoan' }, nam: { $year: '$ngay_thanhtoan' } },
          tong: { $sum: '$so_tien' }
        }
      },
      { $sort: { '_id.nam': 1, '_id.thang': 1 } }
    ]);

    res.json({
      phong: {
        tong: tongPhong,
        trong: phongTrong,
        dang_o: phongDangO,
        bao_duong: phongBaoDuong,
      },
      dat_phong: {
        tong: tongDatPhong,
        theo_trang_thai: datPhongTheoTrangThai,
      },
      tong_doanh_thu: tongDoanhThu,
      dat_phong_gan_day: datPhongGanDay,
      doanh_thu_theo_thang: doanhThuTheoThang,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};