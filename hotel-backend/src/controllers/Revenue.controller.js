const ThanhToan = require('../models/ThanhToan.model');
const DatPhong = require('../models/DatPhong.model');
const Phong = require('../models/Phong.model');

// GET /api/admin/revenue
// Query: from (dd/mm/yy), to (dd/mm/yy), loai_phong (Standard | Deluxe | Suite | All)
exports.getRevenue = async (req, res) => {
  try {
    const { from, to, loai_phong } = req.query;

    // Parse ngày từ query
    const parseDate = (str) => {
      if (!str) return null;
      // Hỗ trợ cả dd/mm/yyyy và yyyy-mm-dd
      if (str.includes('/')) {
        const [d, m, y] = str.split('/');
        return new Date(`${y}-${m}-${d}`);
      }
      return new Date(str);
    };
    const fromDate = parseDate(from);
    const toDate   = parseDate(to);

    // ── Tháng hiện tại ────────────────────────────
    const now = new Date();
    const dauThangNay   = new Date(now.getFullYear(), now.getMonth(), 1);
    const dauThangTruoc = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const cuoiThangTruoc = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [thangNayResult, thangTruocResult] = await Promise.all([
      ThanhToan.aggregate([
        { $match: { trang_thai: 'paid', ngay_thanhtoan: { $gte: dauThangNay } } },
        { $group: { _id: null, tong: { $sum: '$so_tien' } } }
      ]),
      ThanhToan.aggregate([
        { $match: { trang_thai: 'paid', ngay_thanhtoan: { $gte: dauThangTruoc, $lte: cuoiThangTruoc } } },
        { $group: { _id: null, tong: { $sum: '$so_tien' } } }
      ]),
    ]);

    const doanhThuThangNay   = thangNayResult[0]?.tong   || 0;
    const doanhThuThangTruoc = thangTruocResult[0]?.tong || 0;
    const phanTramThayDoi = doanhThuThangTruoc > 0
      ? Number(((doanhThuThangNay - doanhThuThangTruoc) / doanhThuThangTruoc * 100).toFixed(1))
      : 0;

    // ── Occupancy rate ────────────────────────────
    const [tongPhong, phongDangO] = await Promise.all([
      Phong.countDocuments(),
      Phong.countDocuments({ trang_thai: 'occupied' }),
    ]);
    const congSuat = tongPhong > 0
      ? Number((phongDangO / tongPhong * 100).toFixed(1))
      : 0;

    // ── Average room price ────────────────────────
    const giaPhongTB = await Phong.aggregate([
      { $group: { _id: null, tb: { $avg: '$gia_moi_dem' } } }
    ]);
    const avgRoomPrice = Number((giaPhongTB[0]?.tb || 0).toFixed(0));

    // ── Revenue per available room ────────────────
    const revenuePerRoom = tongPhong > 0
      ? Number((doanhThuThangNay / tongPhong).toFixed(0))
      : 0;

    // ── Revenue overview chart (6 tháng) ──────────
    const matchTT = { trang_thai: 'paid' };
    if (fromDate || toDate) {
      matchTT.ngay_thanhtoan = {};
      if (fromDate) matchTT.ngay_thanhtoan.$gte = fromDate;
      if (toDate)   matchTT.ngay_thanhtoan.$lte = toDate;
    } else {
      // Mặc định 6 tháng gần nhất
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      matchTT.ngay_thanhtoan = { $gte: sixMonthsAgo };
    }

    const revenueOverview = await ThanhToan.aggregate([
      { $match: matchTT },
      {
        $group: {
          _id: {
            nam:   { $year: '$ngay_thanhtoan' },
            thang: { $month: '$ngay_thanhtoan' },
          },
          tong: { $sum: '$so_tien' },
        }
      },
      { $sort: { '_id.nam': 1, '_id.thang': 1 } },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $arrayElemAt: [['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], { $subtract: ['$_id.thang', 1] }] },
            ]
          },
          value: '$tong',
        }
      }
    ]);

    // ── Revenue by room type (donut chart) ────────
    const matchDP = {
      trang_thai: { $in: ['confirmed', 'checked_in', 'checked_out'] },
    };
    if (fromDate || toDate) {
      matchDP.ngay_checkin = {};
      if (fromDate) matchDP.ngay_checkin.$gte = fromDate;
      if (toDate)   matchDP.ngay_checkin.$lte = toDate;
    }

    const revenueByType = await DatPhong.aggregate([
      { $match: matchDP },
      { $lookup: { from: 'phongs', localField: 'id_phong', foreignField: '_id', as: 'phong' } },
      { $unwind: '$phong' },
      ...(loai_phong && loai_phong !== 'All'
        ? [{ $match: { 'phong.loai_phong': loai_phong } }]
        : []
      ),
      {
        $group: {
          _id: '$phong.loai_phong',
          tong: { $sum: '$tong_tien' },
          so_dat: { $sum: 1 },
        }
      },
      { $sort: { tong: -1 } },
    ]);

    res.json({
      // 4 stat cards theo PDF
      this_month_revenue:  doanhThuThangNay,
      percent_vs_last_month: phanTramThayDoi,
      occupancy_rate:      congSuat,
      avg_room_price:      avgRoomPrice,
      revenue_per_room:    revenuePerRoom,

      // 2 charts theo PDF
      revenue_overview:    revenueOverview,   // line/area chart
      revenue_by_room_type: revenueByType,    // donut chart
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};