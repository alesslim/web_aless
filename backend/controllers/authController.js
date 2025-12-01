const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const { pool } = require('../config/database');
//const AccessLog = require('../models/AccessLog');
const { checkPasswordStrength } = require('../utils/passwordValidator');

class AuthController {
  // Generar CAPTCHA
  static async getCaptcha(req, res) {
    try {
      const captcha = svgCaptcha.create({
        size: 6,
        noise: 3,
        color: true,
        background: '#f97316'
      });
      
      // Guardar en sesión
      req.session.captcha = captcha.text;
      
      res.type('svg');
      res.status(200).send(captcha.data);
    } catch (error) {
      res.status(500).json({ error: 'Error generando CAPTCHA' });
    }
  }

  // Registro de usuario
  static async register(req, res) {
    try {
      const { username, email, password, captcha } = req.body;

      // 1. Validar CAPTCHA
      if (!req.session.captcha || captcha !== req.session.captcha) {
        return res.status(400).json({ 
          error: 'CAPTCHA incorrecto. Intenta de nuevo.' 
        });
      }

      // 2. Validar fortaleza de contraseña
      const passwordStrength = checkPasswordStrength(password);
      if (passwordStrength === 'débil') {
        return res.status(400).json({ 
          error: 'La contraseña es demasiado débil. Debe contener al menos 8 caracteres, una mayúscula, un número y un carácter especial.' 
        });
      }

      // 3. Verificar si usuario existe
      const [existingUser] = await pool.execute(
        'SELECT id FROM usuarios WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ 
          error: 'El usuario o email ya está registrado.' 
        });
      }

      // 4. Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // 5. Insertar usuario
      const [result] = await pool.execute(
        'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      // 6. Crear token JWT
      const token = jwt.sign(
        { 
          id: result.insertId, 
          username, 
          email,
          role: 'cliente' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // 7. Registrar log de acceso
      await AccessLog.create({
        usuario_id: result.insertId,
        event_type: 'register',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        browser: req.headers['user-agent'] || 'Desconocido'
      });

      // 8. Limpiar CAPTCHA de la sesión
      delete req.session.captcha;

      res.status(201).json({
        success: true,
        token,
        user: {
          id: result.insertId,
          username,
          email,
          role: 'cliente'
        },
        passwordStrength
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Login de usuario
  static async login(req, res) {
    try {
      const { username, password, captcha } = req.body;

      // 1. Validar CAPTCHA
      if (!req.session.captcha || captcha !== req.session.captcha) {
        return res.status(400).json({ 
          error: 'CAPTCHA incorrecto. Intenta de nuevo.' 
        });
      }

      // 2. Buscar usuario por username o email
      const [users] = await pool.execute(
        'SELECT * FROM usuarios WHERE username = ? OR email = ?',
        [username, username]
      );

      if (users.length === 0) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas.' 
        });
      }

      const user = users[0];

      // 3. Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas.' 
        });
      }

      // 4. Verificar si usuario está activo
      if (!user.is_active) {
        return res.status(403).json({ 
          error: 'Tu cuenta está desactivada. Contacta al administrador.' 
        });
      }

      // 5. Actualizar último login
      await pool.execute(
        'UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      // 6. Crear token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // 7. Registrar log de acceso
      await AccessLog.create({
        usuario_id: user.id,
        event_type: 'login',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        browser: req.headers['user-agent'] || 'Desconocido'
      });

      // 8. Limpiar CAPTCHA de la sesión
      delete req.session.captcha;

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          last_login: user.last_login
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      // Registrar log de logout
      await AccessLog.create({
        usuario_id: req.user.id,
        event_type: 'logout',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        browser: req.headers['user-agent'] || 'Desconocido'
      });

      res.json({ 
        success: true, 
        message: 'Sesión cerrada exitosamente.' 
      });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Perfil de usuario
  static async getProfile(req, res) {
    try {
      const [users] = await pool.execute(
        'SELECT id, username, email, role, created_at, last_login FROM usuarios WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.json({ success: true, user: users[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Verificar token
  static async verifyToken(req, res) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ valid: false, error: 'Token no proporcionado.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verificar si usuario aún existe y está activo
      const [users] = await pool.execute(
        'SELECT id, username, email, role, is_active FROM usuarios WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0 || !users[0].is_active) {
        return res.status(401).json({ valid: false, error: 'Usuario no válido.' });
      }

      res.json({ 
        valid: true, 
        user: {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role
        }
      });
    } catch (error) {
      res.status(401).json({ valid: false, error: 'Token inválido o expirado.' });
    }
  }
}

module.exports = AuthController;