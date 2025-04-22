const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'name', 'email', 'password', 'barbershop_id', 'role'],
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const { id, name, barbershop_id, role } = user;

      const token = jwt.sign(
        { id, barbershop_id, role },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );

      return res.json({
        user: {
          id,
          name,
          email,
          barbershop_id,
          role,
        },
        token,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SessionController(); 