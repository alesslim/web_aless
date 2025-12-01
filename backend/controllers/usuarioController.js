// controllers/usuarioController.js
const Usuario = require('../models/usuario');

const usuarioController = {
    // Obtener perfil del usuario autenticado
    getPerfil: async (req, res) => {
        try {
            // req.user.id debería venir del middleware auth.js
            const usuario = await Usuario.findById(req.user.id);
            
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            
            // No devolver la contraseña
            const { password, ...usuarioSinPassword } = usuario;
            
            res.status(200).json({
                success: true,
                data: usuarioSinPassword
            });
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener perfil del usuario'
            });
        }
    },

    // Actualizar perfil del usuario
    actualizarPerfil: async (req, res) => {
        try {
            const { nombre, email } = req.body;
            
            // Validar datos
            if (!nombre || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y email son requeridos'
                });
            }
            
            // Actualizar usuario
            const usuarioActualizado = await Usuario.actualizar(req.user.id, {
                nombre,
                email
            });
            
            res.status(200).json({
                success: true,
                message: 'Perfil actualizado correctamente',
                data: usuarioActualizado
            });
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar perfil'
            });
        }
    },

    // Obtener todos los usuarios (solo admin)
    getAllUsuarios: async (req, res) => {
        try {
            // Verificar si es admin (depende de tu lógica)
            if (req.user.rol !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'No autorizado. Se requiere rol de administrador'
                });
            }
            
            const usuarios = await Usuario.findAll();
            
            // Remover contraseñas de la respuesta
            const usuariosSinPassword = usuarios.map(usuario => {
                const { password, ...rest } = usuario;
                return rest;
            });
            
            res.status(200).json({
                success: true,
                count: usuariosSinPassword.length,
                data: usuariosSinPassword
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios'
            });
        }
    },

    // Eliminar usuario (solo admin o propio usuario)
    eliminarUsuario: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Solo admin puede eliminar otros usuarios
            if (req.user.id !== parseInt(id) && req.user.rol !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'No autorizado para eliminar este usuario'
                });
            }
            
            const eliminado = await Usuario.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Usuario eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar usuario'
            });
        }
    }
};

module.exports = usuarioController;