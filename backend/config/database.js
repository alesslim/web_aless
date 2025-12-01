const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'el_buen_libro_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Probar conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    console.log(`📊 Base de datos: ${process.env.DB_NAME || 'el_buen_libro_db'}`);
    
    // Verificar tablas
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📁 Tablas en la base de datos: ${tables.length}`);
    
    connection.release();
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
    console.error('💡 Solución:');
    console.error('1. Asegúrate de que XAMPP esté ejecutando MySQL');
    console.error('2. Verifica las credenciales en el archivo .env');
    console.error('3. Crea la base de datos con setup-database.sql');
    process.exit(1);
  }
};

module.exports = { pool, testConnection };