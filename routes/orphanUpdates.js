const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { OrphanUpdate, Orphan, Sponsor } = require('../models');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOrphanUpdateEmail(to, orphanName, updateType, description, fileUrl = null) {
  const msg = {
    to,
    from: 'zainahanini03@gmail.com', 
    subject: `${updateType.toUpperCase()} A new update on ${orphanName}`,
    html: `
      <h2>${updateType.charAt(0).toUpperCase() + updateType.slice(1)} Update for ${orphanName}</h2>
      <p>${description}</p>
      ${fileUrl ? `<p><a href="${fileUrl}" target="_blank">View Attachment</a></p>` : ''}
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
  }
}

router.post('/:orphanId/update', async (req, res) => {
  const { orphanId } = req.params;
  const { update_type, description, file_url } = req.body;

  try {
    const update = await OrphanUpdate.create({
      orphan_id: orphanId,
      update_type,
      description,
      file_url
    });

    const orphan = await Orphan.findByPk(orphanId, {
      include: [{ model: Sponsor }]
    });

    if (!orphan || !orphan.Sponsor) {
      return res.status(404).json({ message: 'Orphan or sponsor not found' });
    }

    await sendOrphanUpdateEmail(
      orphan.Sponsor.email,
      orphan.name,
      update_type,
      description,
      file_url
    );

    res.status(201).json({ message: 'Update saved and email sent.' });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
