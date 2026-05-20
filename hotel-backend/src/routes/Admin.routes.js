const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

const heThong   = require('../controllers/Hethong.controller');
const nhanSu    = require('../controllers/Nhansu.controller');
const phong     = require('../controllers/Phong.controller');
const khachHang = require('../controllers/Khachhang.controller');
const datPhong  = require('../controllers/DatPhong.controller');
const revenue   = require('../controllers/Revenue.controller');

const Phong = require("../models/Phong.model");
const onlyAdmin = [protect, requireRole('admin')];

// ── Dashboard ─────────────────────────────────────────────────
router.get('/dashboard', ...onlyAdmin, heThong.dashboard);

// ── Manage Rooms ──────────────────────────────────────────────
router.get   ('/phong',                ...onlyAdmin, phong.danhSach);
router.post  ('/phong',                ...onlyAdmin, phong.taoMoi);
router.get   ('/phong/:id',            ...onlyAdmin, phong.chiTiet);
router.put   ('/phong/:id',            ...onlyAdmin, phong.capNhat);
router.delete('/phong/:id',            ...onlyAdmin, phong.xoa);
router.patch ('/phong/:id/trang-thai', ...onlyAdmin, phong.capNhatTrangThai);

// ── Reservation ───────────────────────────────────────────────
router.get   ('/dat-phong',              ...onlyAdmin, datPhong.danhSach);
router.post  ('/dat-phong',              ...onlyAdmin, datPhong.taoMoi);
router.get   ('/dat-phong/:id',          ...onlyAdmin, datPhong.chiTiet);
router.put   ('/dat-phong/:id',          ...onlyAdmin, datPhong.capNhat);
router.patch ('/dat-phong/:id/xac-nhan', ...onlyAdmin, datPhong.xacNhan);
router.patch ('/dat-phong/:id/huy',      ...onlyAdmin, datPhong.huy);
router.patch ('/dat-phong/:id/checkin',  ...onlyAdmin, datPhong.checkIn);
router.patch ('/dat-phong/:id/checkout', ...onlyAdmin, datPhong.checkOut);

// ── Customers ─────────────────────────────────────────────────
router.get   ('/khach-hang',     ...onlyAdmin, khachHang.danhSach);
router.post  ('/khach-hang',     ...onlyAdmin, khachHang.taoMoi);
router.get   ('/khach-hang/:id', ...onlyAdmin, khachHang.chiTiet);
router.patch ('/khach-hang/:id', ...onlyAdmin, khachHang.capNhat);
router.delete('/khach-hang/:id', ...onlyAdmin, khachHang.xoa);

// ── Employees ─────────────────────────────────────────────────
router.get   ('/nhan-vien',                    ...onlyAdmin, nhanSu.danhSach);
router.post  ('/nhan-vien',                    ...onlyAdmin, nhanSu.taoMoi);
router.get   ('/nhan-vien/:id',                ...onlyAdmin, nhanSu.chiTiet);
router.put   ('/nhan-vien/:id',                ...onlyAdmin, nhanSu.capNhat);
router.delete('/nhan-vien/:id',                ...onlyAdmin, nhanSu.xoa);
router.patch ('/nhan-vien/:id/phan-quyen',     ...onlyAdmin, nhanSu.phanQuyen);
router.patch ('/nhan-vien/:id/reset-mat-khau', ...onlyAdmin, nhanSu.resetMatKhau);

// ── Revenue ───────────────────────────────────────────────────
router.get('/revenue', ...onlyAdmin, revenue.getRevenue);

module.exports = router;