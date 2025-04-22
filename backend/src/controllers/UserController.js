const { User, Barbershop, Appointment } = require('../models/index');
const bcrypt = require('bcryptjs');

class UserController {
  async index(req, res) {
    try {
      const users = await User.findAll({
        where: {
          barbershop_id: req.barbershop_id
        },
        include: [
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          },
        ],
      });
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.id,
          barbershop_id: req.barbershop_id
        },
        include: [
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          },
          {
            model: Appointment,
            as: 'appointments',
            attributes: ['id', 'date', 'status'],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { 
        name, 
        email, 
        password, 
        role = 'admin',
        birth_date,
        document,
        phone,
        barbershop: barbershopData
      } = req.body;

      const shopNameToUse = barbershopData?.name;
      const shopAddressToUse = barbershopData?.address;
      const shopPhoneToUse = barbershopData?.phone;
      const shopEmailToUse = barbershopData?.email;

      if (!name || !email || !password || !shopNameToUse || !shopAddressToUse) {
        return res.status(400).json({ error: 'Name, email, password, shop name and shop address are required' });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const barbershop = await Barbershop.create({
        name: shopNameToUse,
        address: shopAddressToUse,
        phone: shopPhoneToUse,
        email: shopEmailToUse,
      });

      const user = await User.create({
        name,
        email,
        password,
        role,
        birth_date,
        document,
        phone,
        barbershop_id: barbershop.id
      });

      const { id, barbershop_id } = user;
      return res.json({
        id,
        name,
        email,
        role,
        barbershop_id,
        barbershop: {
          id: barbershop.id,
          name: barbershop.name,
          address: barbershop.address,
          phone: barbershop.phone,
          email: barbershop.email,
        }
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async storeUser(req, res) {
    try {
      const {
        name,
        email,
        password,
        role,
        birth_date,
        document,
        phone,
      } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email e password são obrigatórios.' });
      }
  
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email já está em uso.' });
      }
  
      const barbershop = await Barbershop.findByPk(req.barbershop_id);
      if (!barbershop) {
        return res.status(404).json({ error: 'Barbearia não encontrada.' });
      }
  
      const user = await User.create({
        name,
        email,
        password,
        role,
        birth_date,
        document,
        phone,
        barbershop_id: req.barbershop_id
      });
  
      const { id } = user;
  
      return res.status(201).json({
        id,
        name,
        email,
        role,
        barbershop_id: req.barbershop_id,
        barbershop: {
          id: barbershop.id,
          name: barbershop.name,
          address: barbershop.address,
          phone: barbershop.phone,
          email: barbershop.email,
        },
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { 
        name, 
        email, 
        password, 
        role,
        birth_date,
        document,
        phone,
        barbershop_id
      } = req.body;

      const user = await User.findOne({
        where: {
          id,
          barbershop_id: req.barbershop_id
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({
        name,
        email,
        password,
        role,
        birth_date,
        document,
        phone,
        barbershop_id
      });

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.id,
          barbershop_id: req.barbershop_id
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.destroy();
      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController(); 