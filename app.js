require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const db = require('./config/db');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = { id: 1 };
  next();
});


app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user.routes'));
app.use('/orphans', require('./routes/orphan.routes'));
app.use('/donations', require('./routes/donation.routes'));
app.use('/news', require('./routes/news.routes'));
app.use('/sponsorships', require('./routes/sponsorship.routes'));
app.use('/api/orphan-updates', require('./routes/orphanUpdates'));
app.use('/donor', require('./routes/donor'));
app.use('/volunteers', require('./routes/volunteer.routes'));
app.use('/volunteer-applications', require('./routes/volunteerApplication.routes'));
app.use('/volunteer-requests', require('./routes/volunteerRequest.routes'));
app.use('/matching', require('./routes/matching.routes'));
app.use('/betterplace', require('./routes/betterplace.routes'));
app.use('/orphanages', require('./routes/orphanages.routes'));


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
