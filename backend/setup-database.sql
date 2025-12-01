-- ============================================
-- BASE DE DATOS: EL BUEN LIBRO - TIENDA DE LIBROS
-- Creado para proyecto de Programación Web III
-- ============================================

-- 1. Crear base de datos si no existe
DROP DATABASE IF EXISTS el_buen_libro_db;
CREATE DATABASE el_buen_libro_db;
USE el_buen_libro_db;

-- ============================================
-- 2. TABLAS PRINCIPALES
-- ============================================

-- TABLA: usuarios (para login/registro con CAPTCHA)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('cliente', 'admin') DEFAULT 'cliente',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABLA: libros (CRUD con eliminación lógica)
CREATE TABLE libros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria ENUM('Manga', 'Comic', 'Novela', 'Terror', 'Suspenso', 'Acción', 'Otros') NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(500),
    stock INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABLA: carrito (sistema de carrito de compras)
CREATE TABLE carrito (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE,
    UNIQUE KEY unique_carrito (usuario_id, libro_id)
);

-- TABLA: comentarios (sistema de comentarios)
CREATE TABLE comentarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    comentario TEXT NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
);

-- TABLA: ventas (para estadísticas y reportes)
CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- TABLA: items_venta (detalle de ventas)
CREATE TABLE items_venta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venta_id INT NOT NULL,
    libro_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
);

-- TABLA: access_logs (LOGS DE ACCESO - REQUERIDO EN EL PROYECTO)
CREATE TABLE access_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL,
    ip_address VARCHAR(45) NOT NULL,
    event_type ENUM('login', 'logout', 'register', 'access') NOT NULL,
    user_agent TEXT,
    browser VARCHAR(255),
    endpoint VARCHAR(500),
    method VARCHAR(10),
    status_code INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================
-- 3. INSERTAR DATOS DE PRUEBA
-- ============================================

-- Insertar usuario administrador (contraseña: Admin123!)
-- La contraseña encriptada es: $2a$10$TuHashAqui (bcrypt de "Admin123!")
INSERT INTO usuarios (username, email, password, role) VALUES 
('admin', 'admin@elbuenlibro.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqO7.7l5Z8C.6ZJ7WJ6L6n7V8X9Y0Z', 'admin');

-- Insertar usuario cliente (contraseña: Cliente123!)
INSERT INTO usuarios (username, email, password) VALUES 
('cliente', 'cliente@elbuenlibro.com', '$2a$10$AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdefghijklmnop', 'cliente');

-- Insertar libros de Manga
INSERT INTO libros (titulo, autor, precio, categoria, descripcion, imagen_url, stock, rating) VALUES
('Fairytail Volumen 45', 'Hiro Mashima', 150.00, 'Manga', 'Aventuras del gremio de magos más caótico', 'https://m.media-amazon.com/images/I/81EIdomF4FL.jpg', 15, 4.5),
('Dragon Ball Super Vol. 15', 'Akira Toriyama', 180.00, 'Manga', 'Continúa la saga del Torneo del Poder', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt6cjrBcb7m4A5pUzkKZWdeQgSMjMApMs3Ew&s', 25, 4.7),
('Attack on Titan Vol. 34', 'Hajime Isayama', 200.00, 'Manga', 'Final épico de la batalla por la humanidad', 'https://www.akiracomics.com/media/products/113553/113553-0-med.jpg', 8, 4.9),
('My Hero Academia Vol. 36', 'Kohei Horikoshi', 165.00, 'Manga', 'Deku enfrenta nuevos desafíos heroicos', 'https://pm1.aminoapps.com/6681/66ccf65cd2d9225f77fa3dd27d3d08a7e287206e_hq.jpg', 20, 4.6),
('One Piece Vol. 100', 'Eiichiro Oda', 175.00, 'Manga', 'El viaje épico de Luffy continúa', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEgjU1nHebaqP4uN3sGzQzltyblD6pTGcB1Q&s', 12, 4.8);

-- Insertar libros de Comic
INSERT INTO libros (titulo, autor, precio, categoria, descripcion, imagen_url, stock, rating) VALUES
('Heartstopper Tomo 4', 'Alice Oseman', 180.00, 'Comic', 'Historia de amor entre Nick y Charlie', 'https://encantalibros.com/wp-content/uploads/2020/12/9789877475876.jpg', 30, 4.8),
('Batman: The Killing Joke', 'Alan Moore', 220.00, 'Comic', 'Enfrentamiento clásico Batman vs Joker', 'https://i1.whakoom.com/large/22/3b/50c0d20af8f441b49a3d1632e894139a.jpg', 12, 4.9),
('Deadpool: Merc with a Mouth', 'Daniel Way', 190.00, 'Comic', 'Aventuras del mercenario bocazas', 'https://i0.wp.com/comicbookdispatch.com/wp-content/uploads/2024/05/DPOOL2024003_Preview_page_1.jpeg', 18, 4.4),
('Superman: Red Son', 'Mark Millar', 210.00, 'Comic', 'Superman en la Unión Soviética', 'https://www.oldskull.net/wp-content/uploads/2014/03/infinite-crisis-superman.jpg', 10, 4.7);

-- Insertar libros de Novela, Terror, Suspenso, Acción
INSERT INTO libros (titulo, autor, precio, categoria, descripcion, imagen_url, stock, rating) VALUES
('Bajo la Misma Estrella', 'John Green', 120.00, 'Novela', 'Historia de amor entre adolescentes con cáncer', 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1636903987-51xwkWYYgkL.jpg', 25, 4.5),
('Donde Aúllan las Colinas', 'Stephen King', 145.00, 'Terror', 'Terror sobrenatural en pueblo remoto', 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1742386526-516iWLHZrGL.jpg', 15, 4.6),
('La Paciencia Silenciosa', 'Alex Michaelides', 135.00, 'Suspenso', 'Thriller psicológico impactante', 'https://m.media-amazon.com/images/I/91DY3xdkv9L.jpg', 20, 4.4),
('Los Dioses del Norte', 'Neil Gaiman', 160.00, 'Acción', 'Aventura épica en mitología nórdica', 'https://i.blogs.es/e1922e/81borxyvw8l/450_1000.jpeg', 12, 4.7),
('It (Eso)', 'Stephen King', 155.00, 'Terror', 'El payaso Pennywise aterroriza Derry', 'https://images.cdn3.buscalibre.com/fit-in/360x360/85/5f/855fdeee76570e78d276b444a5827c6b.jpg', 18, 4.8),
('Juego de Tronos', 'George R.R. Martin', 185.00, 'Acción', 'Intrigas y batallas en Poniente', 'https://contentv2.tap-commerce.com/cover/large/9788496208965_1.jpg', 22, 4.9);

-- Insertar comentarios de prueba
INSERT INTO comentarios (usuario_id, libro_id, comentario, calificacion) VALUES
(2, 1, '¡Increíble volumen! La batalla final me dejó sin aliento.', 5),
(2, 3, 'El final perfecto para una obra maestra. Lloré.', 5),
(2, 5, 'One Piece nunca decepciona. ¡Quiero el siguiente volumen ya!', 5),
(2, 7, 'Una historia de amor muy tierna y realista. Me encantó.', 4),
(2, 9, 'Superman como nunca antes lo habías visto. Excelente historia alternativa.', 5),
(2, 11, 'Stephen King hace magia con las palabras. Aterrador.', 5);

-- Insertar ventas de prueba para estadísticas
INSERT INTO ventas (usuario_id, total, estado, fecha_venta) VALUES
(2, 530.00, 'completada', '2024-11-15 10:30:00'),
(2, 345.00, 'completada', '2024-11-20 14:45:00'),
(2, 220.00, 'pendiente', '2024-11-25 09:15:00'),
(2, 415.00, 'completada', '2024-11-28 16:20:00'),
(2, 180.00, 'cancelada', '2024-11-29 11:00:00');

-- Insertar items de venta
INSERT INTO items_venta (venta_id, libro_id, cantidad, precio_unitario) VALUES
(1, 1, 2, 150.00),
(1, 3, 1, 200.00),
(1, 5, 1, 180.00),
(2, 2, 1, 180.00),
(2, 4, 1, 165.00),
(3, 6, 1, 220.00),
(4, 8, 1, 210.00),
(4, 10, 1, 145.00),
(4, 12, 1, 185.00),
(5, 7, 1, 180.00);

-- Insertar logs de acceso de prueba
INSERT INTO access_logs (usuario_id, ip_address, event_type, user_agent, endpoint, method, status_code) VALUES
(1, '192.168.1.100', 'login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/api/auth/login', 'POST', 200),
(2, '192.168.1.101', 'register', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '/api/auth/register', 'POST', 201),
(NULL, '192.168.1.102', 'access', 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36', '/api/libros', 'GET', 200),
(2, '192.168.1.101', 'login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', '/api/auth/login', 'POST', 200),
(2, '192.168.1.101', 'logout', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', '/api/auth/logout', 'POST', 200),
(NULL, '192.168.1.103', 'access', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15', '/api/libros?categoria=Manga', 'GET', 200);

-- ============================================
-- 4. VISTAS PARA REPORTES Y ESTADÍSTICAS
-- ============================================

-- Vista: Estadísticas de ventas por categoría
CREATE VIEW vista_ventas_por_categoria AS
SELECT 
    l.categoria,
    COUNT(DISTINCT v.id) as total_ventas,
    SUM(iv.cantidad) as total_libros_vendidos,
    SUM(v.total) as ingresos_totales,
    AVG(v.total) as promedio_venta
FROM ventas v
JOIN items_venta iv ON v.id = iv.venta_id
JOIN libros l ON iv.libro_id = l.id
WHERE v.estado = 'completada'
GROUP BY l.categoria
ORDER BY ingresos_totales DESC;

-- Vista: Libros más vendidos
CREATE VIEW vista_libros_mas_vendidos AS
SELECT 
    l.id,
    l.titulo,
    l.autor,
    l.categoria,
    l.precio,
    SUM(iv.cantidad) as total_vendido,
    SUM(iv.cantidad * iv.precio_unitario) as ingresos_generados
FROM libros l
JOIN items_venta iv ON l.id = iv.libro_id
JOIN ventas v ON iv.venta_id = v.id AND v.estado = 'completada'
GROUP BY l.id
ORDER BY total_vendido DESC
LIMIT 10;

-- Vista: Comentarios recientes
CREATE VIEW vista_comentarios_recientes AS
SELECT 
    c.id,
    c.comentario,
    c.calificacion,
    c.created_at,
    u.username,
    l.titulo as libro_titulo,
    l.categoria as libro_categoria
FROM comentarios c
JOIN usuarios u ON c.usuario_id = u.id
JOIN libros l ON c.libro_id = l.id
WHERE c.is_active = TRUE
ORDER BY c.created_at DESC;

-- Vista: Estadísticas mensuales
CREATE VIEW vista_estadisticas_mensuales AS
SELECT 
    DATE_FORMAT(v.fecha_venta, '%Y-%m') as mes,
    COUNT(DISTINCT v.id) as total_ventas,
    SUM(v.total) as ingresos_totales,
    SUM(iv.cantidad) as total_libros_vendidos,
    COUNT(DISTINCT v.usuario_id) as clientes_unicos
FROM ventas v
JOIN items_venta iv ON v.id = iv.venta_id
WHERE v.estado = 'completada'
GROUP BY DATE_FORMAT(v.fecha_venta, '%Y-%m')
ORDER BY mes DESC;

-- ============================================
-- 5. PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento: Obtener estadísticas del dashboard
DELIMITER //
CREATE PROCEDURE sp_obtener_estadisticas_dashboard()
BEGIN
    -- Total de libros activos
    SELECT 'total_libros' as metric, COUNT(*) as value FROM libros WHERE is_active = TRUE
    UNION ALL
    -- Total de libros por categoría
    SELECT CONCAT('libros_', LOWER(categoria)) as metric, COUNT(*) as value 
    FROM libros WHERE is_active = TRUE GROUP BY categoria
    UNION ALL
    -- Ventas del mes actual
    SELECT 'ventas_mes' as metric, COUNT(*) as value 
    FROM ventas 
    WHERE estado = 'completada' 
    AND MONTH(fecha_venta) = MONTH(CURRENT_DATE()) 
    AND YEAR(fecha_venta) = YEAR(CURRENT_DATE())
    UNION ALL
    -- Ingresos del mes actual
    SELECT 'ingresos_mes' as metric, COALESCE(SUM(total), 0) as value 
    FROM ventas 
    WHERE estado = 'completada' 
    AND MONTH(fecha_venta) = MONTH(CURRENT_DATE()) 
    AND YEAR(fecha_venta) = YEAR(CURRENT_DATE())
    UNION ALL
    -- Usuarios nuevos este mes
    SELECT 'usuarios_nuevos' as metric, COUNT(*) as value
    FROM usuarios
    WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
    AND YEAR(created_at) = YEAR(CURRENT_DATE());
END //
DELIMITER ;

-- Procedimiento: Buscar libros con filtros
DELIMITER //
CREATE PROCEDURE sp_buscar_libros(
    IN p_titulo VARCHAR(200),
    IN p_autor VARCHAR(100),
    IN p_categoria VARCHAR(50),
    IN p_min_precio DECIMAL(10,2),
    IN p_max_precio DECIMAL(10,2)
)
BEGIN
    SELECT * FROM libros 
    WHERE is_active = TRUE
    AND (p_titulo IS NULL OR titulo LIKE CONCAT('%', p_titulo, '%'))
    AND (p_autor IS NULL OR autor LIKE CONCAT('%', p_autor, '%'))
    AND (p_categoria IS NULL OR categoria = p_categoria)
    AND (p_min_precio IS NULL OR precio >= p_min_precio)
    AND (p_max_precio IS NULL OR precio <= p_max_precio)
    ORDER BY titulo;
END //
DELIMITER ;

-- ============================================
-- 6. TRIGGERS PARA AUDITORÍA
-- ============================================

-- Tabla de auditoría para libros
CREATE TABLE libros_audit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    libro_id INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE'),
    usuario_id INT,
    cambios TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (libro_id) REFERENCES libros(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Trigger para registrar creación de libros
DELIMITER //
CREATE TRIGGER tr_libros_after_insert
AFTER INSERT ON libros
FOR EACH ROW
BEGIN
    INSERT INTO libros_audit (libro_id, accion, cambios)
    VALUES (NEW.id, 'INSERT', CONCAT('Libro creado: ', NEW.titulo));
END //
DELIMITER ;

-- Trigger para registrar actualización de libros
DELIMITER //
CREATE TRIGGER tr_libros_after_update
AFTER UPDATE ON libros
FOR EACH ROW
BEGIN
    DECLARE cambios_text TEXT;
    SET cambios_text = '';
    
    IF OLD.titulo != NEW.titulo THEN
        SET cambios_text = CONCAT(cambios_text, 'Título: ', OLD.titulo, ' -> ', NEW.titulo, ' | ');
    END IF;
    
    IF OLD.precio != NEW.precio THEN
        SET cambios_text = CONCAT(cambios_text, 'Precio: ', OLD.precio, ' -> ', NEW.precio, ' | ');
    END IF;
    
    IF OLD.stock != NEW.stock THEN
        SET cambios_text = CONCAT(cambios_text, 'Stock: ', OLD.stock, ' -> ', NEW.stock, ' | ');
    END IF;
    
    IF cambios_text != '' THEN
        INSERT INTO libros_audit (libro_id, accion, cambios)
        VALUES (NEW.id, 'UPDATE', cambios_text);
    END IF;
END //
DELIMITER ;

-- Trigger para registrar eliminación lógica de libros
DELIMITER //
CREATE TRIGGER tr_libros_after_delete
AFTER UPDATE ON libros
FOR EACH ROW
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        INSERT INTO libros_audit (libro_id, accion, cambios)
        VALUES (NEW.id, 'DELETE', CONCAT('Libro eliminado: ', NEW.titulo));
    END IF;
END //
DELIMITER ;

-- ============================================
-- 7. ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

CREATE INDEX idx_libros_titulo ON libros(titulo);
CREATE INDEX idx_libros_autor ON libros(autor);
CREATE INDEX idx_libros_categoria ON libros(categoria);
CREATE INDEX idx_libros_precio ON libros(precio);
CREATE INDEX idx_libros_is_active ON libros(is_active);

CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_estado ON ventas(estado);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);

CREATE INDEX idx_comentarios_libro ON comentarios(libro_id);
CREATE INDEX idx_comentarios_usuario ON comentarios(usuario_id);
CREATE INDEX idx_comentarios_created ON comentarios(created_at);

CREATE INDEX idx_access_logs_usuario ON access_logs(usuario_id);
CREATE INDEX idx_access_logs_timestamp ON access_logs(timestamp);
CREATE INDEX idx_access_logs_event ON access_logs(event_type);

-- ============================================
-- 8. FUNCIONES ÚTILES
-- ============================================

-- Función: Calcular edad del libro en días
DELIMITER //
CREATE FUNCTION fn_edad_libro_dias(libro_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE dias INT;
    SELECT DATEDIFF(CURRENT_DATE(), created_at) INTO dias 
    FROM libros WHERE id = libro_id;
    RETURN dias;
END //
DELIMITER ;

-- Función: Calcular valor total del inventario
DELIMITER //
CREATE FUNCTION fn_valor_total_inventario()
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT SUM(precio * stock) INTO total FROM libros WHERE is_active = TRUE;
    RETURN COALESCE(total, 0);
END //
DELIMITER ;

-- ============================================
-- 9. CONSULTAS DE PRUEBA
-- ============================================

-- Mostrar mensaje de éxito
SELECT '==========================================' as mensaje;
SELECT '✅ BASE DE DATOS CONFIGURADA EXITOSAMENTE' as mensaje;
SELECT '==========================================' as mensaje;
SELECT '' as mensaje;

-- Mostrar estadísticas iniciales
SELECT '📊 ESTADÍSTICAS INICIALES:' as mensaje;
SELECT '' as mensaje;

SELECT '👥 Usuarios:' as categoria, COUNT(*) as total FROM usuarios
UNION ALL
SELECT '📚 Libros activos:', COUNT(*) FROM libros WHERE is_active = TRUE
UNION ALL
SELECT '💰 Ventas completadas:', COUNT(*) FROM ventas WHERE estado = 'completada'
UNION ALL
SELECT '💬 Comentarios:', COUNT(*) FROM comentarios WHERE is_active = TRUE
UNION ALL
SELECT '📋 Logs de acceso:', COUNT(*) FROM access_logs;

SELECT '' as mensaje;
SELECT '📈 Libros por categoría:' as reporte;
SELECT categoria, COUNT(*) as cantidad, SUM(stock) as stock_total
FROM libros WHERE is_active = TRUE
GROUP BY categoria
ORDER BY cantidad DESC;

SELECT '' as mensaje;
SELECT '🏆 Libros más vendidos:' as reporte;
SELECT titulo, autor, categoria, precio FROM vista_libros_mas_vendidos LIMIT 5;

SELECT '' as mensaje;
SELECT '💳 Ventas por categoría:' as reporte;
SELECT * FROM vista_ventas_por_categoria;

SELECT '' as mensaje;
SELECT '==========================================' as mensaje;
SELECT '🎉 ¡Base de datos lista para usar!' as mensaje;
SELECT '==========================================' as mensaje;