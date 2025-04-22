const { Appointment, Barbershop, Service, User } = require('../models');

class DashboardController {
  async index(req, res) {
    try {
      const { barbershopId } = req.params;

      // Buscar dados da barbearia
      const barbershop = await Barbershop.findByPk(barbershopId, {
        attributes: ['id', 'name', 'address', 'phone', 'email'],
        where: {
          barbershop_id: req.barbershop_id
        },
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

      if (!barbershop) {
        return res.status(404).json({ error: 'Barbearia não encontrada' });
      }

      // Buscar agendamentos recentes
      const recentAppointments = await Appointment.findAll({
        where: { barbershopId },
        limit: 5,
        order: [['date', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id', 'name', 'price'],
          },
        ],
      });

      // Buscar estatísticas
      const totalAppointments = await Appointment.count({ where: { barbershopId } });
      const totalServices = await Service.count({ where: { barbershopId } });
      const totalUsers = await User.count({ where: { barbershopId } });

      return res.json({
        barbershop,
        recentAppointments,
        statistics: {
          totalAppointments,
          totalServices,
          totalUsers,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new DashboardController(); 