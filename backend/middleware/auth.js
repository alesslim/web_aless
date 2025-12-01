const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado. Se requiere autenticación.' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si usuario existe y está activo
    const [users] = await pool.execute(
      'SELECT id, username, email, role, is_active FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    if (!users[0].is_active) {
      return res.status(403).json({ error: 'Tu cuenta está desactivada.' });
    }

    // Adjuntar usuario a la request
    req.user = {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email,
      role: users[0].role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    res.status(500).json({ error: 'Error de autenticación.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para realizar esta acción.' 
      });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };