const Orphan = require('../models/orphan.model');

exports.createOrphan = async (req, res) => {
  try {
    const orphan = await Orphan.create(req.body);
    res.status(201).json(orphan);
  } catch (err) {
    console.error("Error creating orphan's profile", err);
    res.status(500).json({ error: "Could not create the orphan's profile" });
  }
};

exports.getAllOrphans = async (req, res) => {
  try {
    const orphans = await Orphan.findAll();
    res.json(orphans);
  } catch (err) {
    res.status(500).json({ error: "Failed to get all orphans' profiles" });
  }
};
