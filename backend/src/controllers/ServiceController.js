const { Service, Barbershop, AppointmentService } = require('../models/index');

class ServiceController {
  async index(req, res) {
    try {
      console.log('Buscando serviços para a barbearia:', req.barbershop_id);
      const services = await Service.findAll({
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
      console.log('Serviços encontrados:', services);
      return res.json(services);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return res.status(400).json({ 
        error: error.message,
        details: error.stack 
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findOne({
        where: {
          id,
          barbershop_id: req.barbershop_id
        },
        include: [
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          },
          {
            model: AppointmentService,
            as: 'appointment_services',
            attributes: ['id', 'appointment_id'],
          },
        ],
      });

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      return res.json(service);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name, value } = req.body;

      const service = await Service.create({
        name,
        value,
        barbershop_id: req.barbershop_id
      });

      return res.json(service);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, value } = req.body;

      const service = await Service.findOne({
        where: {
          id,
          barbershop_id: req.barbershop_id
        }
      });

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      await service.update({
        name,
        value
      });

      return res.json(service);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const service = await Service.findOne({
        where: {
          id,
          barbershop_id: req.barbershop_id
        }
      });

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      await service.destroy();
      return res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ServiceController(); 