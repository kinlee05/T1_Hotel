exports.requireRole = (...roles) => (req, res, next) => {
  const vaiTro = req.user?.id_vaitro?.ten_vaitro;
  if (!roles.includes(vaiTro)) {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }
  next();
};