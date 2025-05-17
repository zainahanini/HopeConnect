const User = require('../models/user.model');

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error', error: error.message });
  }
};

module.exports = isAdmin;
