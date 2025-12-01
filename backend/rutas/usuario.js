// rutas/usuario.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth'); // Tu middleware de autenticación

// ======================
// RUTAS PROTEGIDAS
// ======================

// Todas las rutas requieren autenticación
router.use(auth);

// Obtener perfil del usuario logueado
router.get('/perfil', usuarioController.getPerfil);

// Actualizar perfil
router.put('/perfil', usuarioController.actualizarPerfil);

// ======================
// RUTAS DE ADMIN (opcional)
// ======================

// Obtener todos los usuarios (solo admin)
router.get('/todos', usuarioController.getAllUsuarios);

// Eliminar usuario
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;