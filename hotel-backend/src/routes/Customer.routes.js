const express = require('express');
const router  = express.Router();
const { protect }      = require('../middlewares/auth.middleware');
const { requireRole }  = require('../middlewares/role.middleware');
const customer = require('../controllers/Customer.controller');

// Tất cả route cần đăng nhập + role khach_hang
const onlyCustomer = [protect, requireRole('khach_hang')];

// ── Profile ──────────────────────────────────
router.get  ('/profile',         ...onlyCustomer, customer.getProfile);
router.patch('/profile',         ...onlyCustomer, customer.updateProfile);

// ── Giỏ hàng / kiểm tra ──────────────────────
router.post ('/gio-hang/kiem-tra', ...onlyCustomer, customer.kiemTraGioHang);

// ── Đặt phòng ────────────────────────────────
router.post ('/dat-phong',       ...onlyCustomer, customer.datPhong);

// ── Đơn hàng ─────────────────────────────────
router.get  ('/don-hang',        ...onlyCustomer, customer.danhSachDonHang);
router.get  ('/don-hang/:id',    ...onlyCustomer, customer.chiTietDonHang);
router.patch('/don-hang/:id/huy',...onlyCustomer, customer.huyDonHang);

// ── Thanh toán ───────────────────────────────
router.post ('/thanh-toan',      ...onlyCustomer, customer.thanhToan);
router.get  ('/hoa-don/:id_datphong', ...onlyCustomer, customer.xemHoaDon);

// ── Đánh giá ─────────────────────────────────
router.post ('/danh-gia',        ...onlyCustomer, customer.taoMoiDanhGia);
router.get  ('/danh-gia',        ...onlyCustomer, customer.danhSachDanhGia);

// ── Lịch sử ──────────────────────────────────
router.get  ('/lich-su',         ...onlyCustomer, customer.lichSu);

module.exports = router;