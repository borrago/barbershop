const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // Verifica se o usuário está autenticado
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Busca o usuário e sua barbearia
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'barbershop_id'],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.barbershop_id) {
      return res.status(400).json({ error: 'User is not associated with any barbershop' });
    }

    // Adiciona o barbershop_id à requisição
    req.barbershop_id = user.barbershop_id;
    
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 