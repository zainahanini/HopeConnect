const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class UserController {
 static async registerUser(req, res) {
  try {
    const { full_name, email, password, role } = req.body;

    if (role === 'admin') {
      return res.status(403).json({ message: 'You cannot register as admin directly' });
    }

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

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token, userId: user.id, role: user.role });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updates = req.body;

      const [updated] = await User.update(updates, { where: { id: userId } });
      if (updated) {
        const updatedUser = await User.findByPk(userId);
        return res.json(updatedUser);
      }
      res.status(404).json({ message: 'User not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const deleted = await User.destroy({ where: { id: userId } });
      if (deleted) {
        return res.json({ message: 'User deleted successfully' });
      }
      res.status(404).json({ message: 'User not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createAdmin(req, res) {
  try {
    const { full_name, email, password } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password_hash,
      role: 'admin',
    });

    res.status(201).json({ message: 'Admin created successfully', user });
  } catch (err) {
    console.error('Admin creation error:', err);
    res.status(500).json({ error: 'Failed to create admin' });
  }
}

}

module.exports = UserController;
