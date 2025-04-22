const { Appointment, AppointmentService, Client, User, Barbershop, Service } = require('../models/index');

class AppointmentController {
  async index(req, res) {
    try {
      const appointments = await Appointment.findAll({
        where: {
          barbershop_id: req.barbershop_id
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          },
          {
            model: Service,
            as: 'services',
            attributes: ['id', 'name', 'value'],
            through: { attributes: [] },
          },
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'name', 'email', 'phone'],
          },
        ],
      });
      return res.json(appointments);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Barbershop,
            as: 'barbershop',
            attributes: ['id', 'name', 'address', 'phone', 'email'],
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id', 'name', 'price', 'duration'],
          },
        ],
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const {
        appointment_date,
        client_id,
        user_id,
        services,
        total_value,
      } = req.body;
  
      if (!appointment_date || !client_id || !user_id || !services?.length) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
      }
  
      const appointment = await Appointment.create({
        appointment_date,
        client_id,
        user_id,
        barbershop_id: req.barbershop_id,
        total_value: parseFloat(total_value),
      });
  
      const records = services.map((service_id) => ({
        appointment_id: appointment.id,
        service_id,
      }));
  
      await AppointmentService.bulkCreate(records);
  
      const result = await Appointment.findByPk(appointment.id, {
        include: [
          { model: Service, as: 'services' },
          { model: Client, as: 'client' },
          { model: User, as: 'user' },
        ],
      });
  
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        appointment_date,
        client_id,
        user_id,
        services, // array de ids
        total_value,
      } = req.body;
  
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
  
      await appointment.update({
        appointment_date,
        client_id,
        user_id,
        total_value,
      });
  
      // Remove vínculos antigos
      await AppointmentService.destroy({ where: { appointment_id: id } });
  
      // Cria novos vínculos
      const newServices = services.map((service_id) => ({
        appointment_id: id,
        service_id,
      }));
  
      await AppointmentService.bulkCreate(newServices);
  
      const updatedAppointment = await Appointment.findByPk(id, {
        include: [
          { model: Client, as: 'client' },
          { model: User, as: 'user' },
          {
            model: Service,
            as: 'services',
            attributes: ['id', 'name', 'value'],
            through: { attributes: [] },
          },
        ],
      });
  
      return res.json(updatedAppointment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }  

  async delete(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      await appointment.destroy();
      return res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AppointmentController(); 