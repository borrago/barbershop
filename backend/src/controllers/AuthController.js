const { User, Barbershop } = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ 
        where: { email },
        include: [
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          }
        ]
      });
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign({ 
        id: user.id,
        barbershop_id: user.barbershop_id,
        role: user.role
      }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const { id, name, role, barbershop } = user;
      return res.json({
        user: { id, name, email, role, barbershop },
        token,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { name, email, password, role, barbershop } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Primeiro cria a barbearia
      const newBarbershop = await Barbershop.create({
        name: barbershop.name,
        address: barbershop.address,
        phone: barbershop.phone,
        email: barbershop.email,
      });

      // Depois cria o usuário com o ID da barbearia
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'admin',
        barbershop_id: newBarbershop.id,
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const { id, name: userName, role: userRole } = user;
      return res.json({
        user: { id, name: userName, email, role: userRole },
        token,
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController(); 