const express = require('express');
const router = express.Router();
const sendEmail = require('../services/sendEmail');
const sequelize = require('../config/db');
const OrphanUpdate = require('../models/orphan_update')(sequelize, require('sequelize').DataTypes);


const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/update', authenticateToken, isAdmin, async (req, res) => {
  const { orphanId, updateType, description, sponsorEmail } = req.body;

  try {
    await OrphanUpdate.create({
      orphan_id: orphanId,
      update_type: updateType,
      description: description,
      file_url: '',
    });

    const subject = `New update from #${orphanId}`;
    const html = `
      <h2>New ${updateType} update</h2>
      <p>${description}</p>
    `;

    await sendEmail(sponsorEmail, subject, html);

    res.status(200).json({ message: 'update saved and email sent to the sponser.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'something went wrong, try again.' });
  }
});

module.exports = router;
