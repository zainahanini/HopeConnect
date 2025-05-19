const isStaff = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

  if (req.user.role !== 'orphanage_staff') {
    return res.status(403).json({ message: 'Access denied: orphanage staff only' });
  }
  
  next();
};

module.exports = isStaff;
