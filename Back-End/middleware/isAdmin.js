// === Back-End/middleware/isAdmin.js ===
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Akses ditolak, bukan admin' });
};

module.exports = isAdmin;
