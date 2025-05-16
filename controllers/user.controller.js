const User = require('../models/user.model');

exports.registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || user.password_hash !== password) {
    return res.status(401).json({ message: "Invalid credentials, check again" });
  }

  res.json({ token: 'mock-token', userId: user.id, role: user.role });
};
