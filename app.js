require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./config/db');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user.routes');
const orphanRouter = require('./routes/orphan.routes');
const donationRouter = require('./routes/donation.routes');
const newsRouter = require('./routes/news.routes');
const sponsorshipRoutes = require('./routes/sponsorship.routes');
const orphanUpdatesRouter = require('./routes/orphanUpdates');
const donorRoutes = require('./routes/donor');
const emergencyCampaignRoutes = require('./routes/emergencyCampaign.routes');
const partnerRoutes = require('./routes/partner.routes');
const messageRouter = require('./routes/message.routes');
const volunteerRoutes = require('./routes/volunteer.routes');
const volunteerApplicationRoutes = require('./routes/volunteerApplication.routes');
const volunteerRequestRoutes = require('./routes/volunteerRequest.routes');
const matchingRoutes = require('./routes/matching.routes');
const betterplaceRoutes = require('./routes/betterplace.routes');
const orphanagesRoutes = require('./routes/orphanages.routes');
const reviewRoutes = require('./routes/review.routes');
const deliveryRoutes = require('./routes/delivery.routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orphans', orphanRouter);
app.use('/donations', donationRouter);
app.use('/news', newsRouter);
app.use('/sponsorships', sponsorshipRoutes);
app.use('/api/orphan-updates', orphanUpdatesRouter);
app.use('/donor', donorRoutes);
app.use('/emergency-campaigns', emergencyCampaignRoutes);
app.use('/partners', partnerRoutes);
app.use('/messages', messageRouter);
app.use('/volunteers', volunteerRoutes);
app.use('/volunteer-applications', volunteerApplicationRoutes);
app.use('/volunteer-requests', volunteerRequestRoutes);
app.use('/matching', matchingRoutes);
app.use('/betterplace', betterplaceRoutes);
app.use('/orphanages', orphanagesRoutes);
app.use('/reviews', reviewRoutes);
app.use('/driver', deliveryRoutes);


app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});


app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
      ...(req.app.get('env') === 'development' && { stack: err.stack }),
    },
  });
});


db.sync()
  .then(() => {
    console.log('Connected to MySQL and synced models');
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

module.exports = app;
