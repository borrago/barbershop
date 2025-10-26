const sequelize = require('../database/index');

// Middleware para verificar e reconectar ao banco se necessário
const checkDatabaseConnection = async (req, res, next) => {
  try {
    // Verifica se a conexão está ativa
    await sequelize.authenticate();
    next();
  } catch (error) {
    console.error('Database connection lost, attempting to reconnect...', error.message);
    
    try {
      // Tenta reconectar
      await sequelize.authenticate();
      console.log('Database reconnected successfully');
      next();
    } catch (reconnectError) {
      console.error('Failed to reconnect to database:', reconnectError.message);
      res.status(503).json({ 
        error: 'Database connection failed',
        message: 'Service temporarily unavailable. Please try again later.'
      });
    }
  }
};

module.exports = checkDatabaseConnection;
