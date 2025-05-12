const Orphan = require('../../../Desktop/4th year 2nd semester/advanced/hopeconnect-nodejs-pg/models/orphan.model');

exports.createOrphan = async (req, res) => {
  const orphan = await Orphan.create(req.body);
  res.status(201).json(orphan);
};

exports.getAllOrphans = async (req, res) => {
  const orphans = await Orphan.findAll({ include: 'sponsor' });
  res.json(orphans);
};
