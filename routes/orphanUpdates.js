const express = require('express');
const router = express.Router();
const sendEmail = require('../services/sendEmail');
const db = require('../models'); 

router.post('/update', async (req, res) => {
  const { orphanId, updateType, description, sponsorEmail } = req.body;

  try {
    await db.orphan_updates.create({
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

    res.status(200).json({ message: 'Update saved and email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
