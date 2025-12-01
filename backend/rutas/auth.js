const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// CAPTCHA
router.get('/captcha', AuthController.getCaptcha);

// Registro
router.post('/register', AuthController.register);

// Login
router.post('/login', AuthController.login);

// Logout (requiere autenticación)
router.post('/logout', authenticate, AuthController.logout);

// Perfil (requiere autenticación)
router.get('/profile', authenticate, AuthController.getProfile);

// Verificar token
router.get('/verify', AuthController.verifyToken);

module.exports = router;