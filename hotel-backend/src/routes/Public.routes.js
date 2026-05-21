const express = require('express');
const router  = express.Router();
const pub = require('../controllers/Public.controller');

// Không cần auth — ai cũng xem được
router.get('/phong',       pub.danhSachPhong);
router.get('/phong/:id',   pub.chiTietPhong);
router.get('/dich-vu',     pub.danhSachDichVu);

module.exports = router;