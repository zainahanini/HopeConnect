const Message = require('../models/message');


exports.createMessage = async (req, res) => {
  try {
    const { sponsor_id, orphan_id, sender, message } = req.body;

    if (!['sponsor', 'orphan'].includes(sender)) {
      return res.status(400).json({ error: 'Invalid sender value' });
    }

    const newMessage = await Message.create({
      sponsor_id,
      orphan_id,
      sender,
      message,
      status: 'pending', 
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.status = status;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesForOrphan = async (req, res) => {
  try {
    const { orphanId } = req.params;

    const messages = await Message.findAll({
      where: { orphan_id: orphanId, status: 'approved' },
      order: [['sent_at', 'DESC']]  
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
