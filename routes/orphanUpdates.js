const express = require('express');
const router = express.Router();

const OrphanUpdate = require('../models/orphan_update');
const sendEmail = require('../services/sendEmail');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/update', authenticateToken, isAdmin, async (req, res) => {
  const { orphanId, updateType, description, sponsorEmail } = req.body;

  try {
    await OrphanUpdate.create({
      orphan_id: orphanId,
      update_type: updateType,
      description: description,
      file_url: ''
    });

    const subject = `New update from orphan #${orphanId}`;
    const html = `
      <h2>New ${updateType} update</h2>
      <p>${description}</p>
    `;

    await sendEmail(sponsorEmail, subject, html);

    res.status(200).json({ message: 'Update saved and email sent to the sponsor.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong, try again.' });
  }
});

module.exports = router;
