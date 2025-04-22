const { Client, Barbershop } = require('../models');

class ClientController {
  async index(req, res) {
    try {
      const clients = await Client.findAll({
        where: {
          barbershop_id: req.barbershop_id
        },
        include: [
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          }
        ],
        attributes: ['id', 'name', 'email', 'phone', 'birth_date'],
        order: [['name', 'ASC']],
      });

      return res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async show(req, res) {
    try {
      const client = await Client.findOne({
        where: {
          id: req.params.id,
          barbershop_id: req.barbershop_id
        },
        include: [
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          }
        ]
      });
      
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      return res.json(client);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name, email, phone, birth_date } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const client = await Client.create({
        name,
        email,
        phone,
        birth_date,
        barbershop_id: req.barbershop_id
      });

      return res.json(client);
    } catch (error) {
      console.error('Error creating client:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const client = await Client.findOne({
        where: {
          id: req.params.id,
          barbershop_id: req.barbershop_id
        }
      });

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      const { name, phone, email, birth_date } = req.body;
      await client.update({
        name,
        phone,
        email,
        birth_date
      });

      return res.json(client);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const client = await Client.findOne({
        where: {
          id: req.params.id,
          barbershop_id: req.barbershop_id
        }
      });

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      await client.destroy();
      return res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ClientController(); 