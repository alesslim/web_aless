const { pool } = require('../config/database');

class Usuario {
  // Buscar por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, is_active, created_at, last_login FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  // Buscar por username o email
  static async findByUsernameOrEmail(identifier) {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE username = ? OR email = ?',
      [identifier, identifier]
    );
    return rows[0] || null;
  }

  // Crear usuario
  static async create(userData) {
    const { username, email, password, role = 'cliente' } = userData;
    
    const [result] = await pool.execute(
      'INSERT INTO usuarios (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );
    
    return { id: result.insertId, username, email, role };
  }

  // Actualizar último login
  static async updateLastLogin(id) {
    await pool.execute(
      'UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    return true;
  }

  // Cambiar estado activo/inactivo
  static async toggleActive(id, isActive) {
    await pool.execute(
      'UPDATE usuarios SET is_active = ? WHERE id = ?',
      [isActive, id]
    );
    return true;
  }

  // Obtener todos los usuarios (admin)
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, is_active, created_at, last_login FROM usuarios ORDER BY created_at DESC'
    );
    return rows;
  }

  // Obtener estadísticas de usuarios
  static async getStats() {
    const [stats] = await pool.execute(`
      SELECT 
        role,
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as activos,
        COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as activos_30d,
        DATE(created_at) as fecha_registro,
        COUNT(*) as registros_por_dia
      FROM usuarios
      GROUP BY role, DATE(created_at)
      ORDER BY fecha_registro DESC
    `);
    return stats;
  }
}

module.exports = Usuario;