const User = require('../../../Desktop/4th year 2nd semester/advanced/hopeconnect-nodejs-pg/models/user.model');

exports.registerUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ message: 'User registered' });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  res.json({ token: 'mock-token', message: 'Login simulated' });
};
