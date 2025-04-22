const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({ error: 'Token malformatted' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded.id || !decoded.barbershop_id) {
        console.error('Token inválido - dados ausentes:', decoded);
        return res.status(401).json({ error: 'Invalid token data' });
      }

      console.log('Token decodificado:', decoded);
      
      req.userId = decoded.id;
      req.barbershop_id = decoded.barbershop_id;
      req.userRole = decoded.role;

      return next();
    } catch (err) {
      console.error('Erro ao verificar token:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(400).json({ error: error.message });
  }
}; 