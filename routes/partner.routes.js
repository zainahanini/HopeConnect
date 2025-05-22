const express = require('express');
const router = express.Router();
const PartnerController = require('../controllers/partner.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authenticateToken, isAdmin, PartnerController.createPartner);

router.get('/', PartnerController.getAllPartners);
router.get('/:id', PartnerController.getPartnerById);

router.put('/:id', authenticateToken, isAdmin, PartnerController.updatePartner);
router.delete('/:id', authenticateToken, isAdmin, PartnerController.deletePartner);


module.exports = router;
