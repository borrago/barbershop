const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Erro de chave duplicada do Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate Entry',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Erro de registro não encontrado
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: err.message || 'Resource not found'
    });
  }

  // Erro de autenticação
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      error: err.message || 'Authentication failed'
    });
  }

  // Erro de autorização
  if (err.name === 'AuthorizationError') {
    return res.status(403).json({
      error: err.message || 'Not authorized'
    });
  }

  // Erro genérico
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler; 