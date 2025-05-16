
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');

router.get('/orphans-gaza', newsController.getOrphansInGazaNews);

module.exports = router;
