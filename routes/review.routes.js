const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const Authenticate = require('../middleware/authenticateToken');

router.post('/', Authenticate, reviewController.createReview);
router.get('/projects/:projectId', reviewController.getProjectReviews);
module.exports = router;