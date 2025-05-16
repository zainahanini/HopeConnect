const bcrypt = require('bcrypt');
const User = require('../models/user.model');

class UserController {
  static async registerUser(req, res) {
    try {
      const { full_name, email, password, role } = req.body;

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        full_name,
        email,
        password_hash,
        role,
      });

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials, check again' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials, check again' });
      }

      res.json({ token: 'mock-token', userId: user.id, role: user.role });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
}

module.exports = UserController;
