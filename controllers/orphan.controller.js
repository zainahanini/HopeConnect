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

exports.updateOrphan = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.id);
    if (!orphan) return res.status(404).json({ error: 'Orphan not found' });

    await orphan.update(req.body);
    res.json(orphan);
  } catch (err) {
    console.error("Error updating orphan's profile", err);
    res.status(500).json({ error: "Could not update the orphan's profile" });
  }
};

exports.deleteOrphan = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.id);
    if (!orphan) return res.status(404).json({ error: 'Orphan not found' });

    await orphan.destroy();
    res.json({ message: 'Orphan deleted successfully' });
  } catch (err) {
    console.error("Error deleting orphan's profile", err);
    res.status(500).json({ error: "Could not delete the orphan's profile" });
  }
};
