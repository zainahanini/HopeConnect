const Review=require("../models/review.model");
const User=require("../models/user.model");
const Donation=require("../models/donation.model");
const sequelize = require('../config/db');
exports.createReview = async (req, res) => {
  try {
    const { project_id, rating, comment } = req.body;
    const user_id = req.user.id;

    const hasDonated = await Donation.findOne({ where: { user_id, project_id } });
    if (!hasDonated) {
      return res.status(403).json({ message: 'Only donors can leave reviews.' });
    }

    const review = await Review.create({ user_id, project_id, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProjectReviews = async (req, res) => {
  try {
    const { projectId } = req.params;

    const reviews = await Review.findAll({
      where: { project_id: projectId },
      include: [{ model: User, attributes: ['full_name'] }]
    });

    const averageResult = await Review.findOne({
      where: { project_id: projectId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });

    const avgRating = parseFloat(averageResult.avgRating).toFixed(2);

    res.json({
      averageRating: avgRating,
      reviews
    });

  } catch (error) {
    console.error('Error fetching project reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

