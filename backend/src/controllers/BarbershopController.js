const { Barbershop, User, Service } = require('../models/index');

class BarbershopController {
  async index(req, res) {
    try {
      const barbershops = await Barbershop.findAll({
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['id', 'name', 'email', 'role'],
          },
          {
            model: Service,
            as: 'services',
            attributes: ['id', 'name', 'value'],
          },
        ],
      });
      return res.json(barbershops);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const barbershop = await Barbershop.findByPk(id, {
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['id', 'name', 'email', 'role'],
          },
          {
            model: Service,
            as: 'services',
            attributes: ['id', 'name', 'description', 'price', 'duration'],
          },
        ],
      });

      if (!barbershop) {
        return res.status(404).json({ error: 'Barbershop not found' });
      }

      return res.json(barbershop);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name, address, phone, email } = req.body;
      const barbershop = await Barbershop.create({
        name,
        address,
        phone,
        email,
      });
      return res.json(barbershop);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, address, phone, email } = req.body;

      const barbershop = await Barbershop.findByPk(id);
      if (!barbershop) {
        return res.status(404).json({ error: 'Barbershop not found' });
      }

      await barbershop.update({
        name,
        address,
        phone,
        email,
      });

      return res.json(barbershop);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const barbershop = await Barbershop.findByPk(id);

      if (!barbershop) {
        return res.status(404).json({ error: 'Barbershop not found' });
      }

      await barbershop.destroy();
      return res.json({ message: 'Barbershop deleted successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new BarbershopController(); 