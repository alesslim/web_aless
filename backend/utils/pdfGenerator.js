const PDFDocument = require('pdfkit');
const { pool } = require('../config/database');

class PDFGenerator {
  // Generar reporte de ventas
  static async generateSalesReport(startDate, endDate) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Obtener datos de ventas
        const [ventas] = await pool.execute(`
          SELECT 
            v.id,
            v.fecha_venta,
            u.username as cliente,
            v.total,
            v.estado,
            COUNT(iv.id) as total_items
          FROM ventas v
          JOIN usuarios u ON v.usuario_id = u.id
          JOIN items_venta iv ON v.id = iv.venta_id
          WHERE DATE(v.fecha_venta) BETWEEN ? AND ?
          GROUP BY v.id
          ORDER BY v.fecha_venta DESC
        `, [startDate, endDate]);

        // Encabezado
        doc.fontSize(25).text('EL BUEN LIBRO', { align: 'center' });
        doc.fontSize(16).text('Reporte de Ventas', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Período: ${startDate} al ${endDate}`, { align: 'center' });
        doc.moveDown();
        
        // Resumen
        const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
        doc.fontSize(14).text('RESUMEN', { underline: true });
        doc.fontSize(12).text(`Total de ventas: ${ventas.length}`);
        doc.text(`Ingresos totales: Bs ${totalVentas.toFixed(2)}`);
        doc.moveDown();
        
        // Tabla de ventas
        doc.fontSize(14).text('DETALLE DE VENTAS', { underline: true });
        doc.moveDown();
        
        // Encabezados de tabla
        const tableTop = doc.y;
        const tableLeft = 50;
        
        doc.fontSize(10).text('ID', tableLeft, tableTop);
        doc.text('Fecha', tableLeft + 50, tableTop);
        doc.text('Cliente', tableLeft + 150, tableTop);
        doc.text('Items', tableLeft + 250, tableTop);
        doc.text('Total', tableLeft + 300, tableTop);
        doc.text('Estado', tableLeft + 380, tableTop);
        
        doc.moveTo(tableLeft, tableTop + 15)
          .lineTo(tableLeft + 450, tableTop + 15)
          .stroke();
        
        // Filas de la tabla
        let y = tableTop + 25;
        ventas.forEach((venta, index) => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
          
          doc.fontSize(9).text(venta.id.toString(), tableLeft, y);
          doc.text(new Date(venta.fecha_venta).toLocaleDateString(), tableLeft + 50, y);
          doc.text(venta.cliente, tableLeft + 150, y);
          doc.text(venta.total_items.toString(), tableLeft + 250, y);
          doc.text(`Bs ${parseFloat(venta.total).toFixed(2)}`, tableLeft + 300, y);
          doc.text(venta.estado, tableLeft + 380, y);
          
          y += 20;
        });
        
        // Pie de página
        doc.fontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 50, 750, { align: 'left' });
        doc.text('El Buen Libro - Sistema de Gestión', 0, 750, { align: 'center' });
        doc.text(`Página ${doc.bufferedPageRange().count}`, 0, 750, { align: 'right' });
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generar reporte de inventario
  static async generateInventoryReport() {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Obtener datos de inventario
        const [libros] = await pool.execute(`
          SELECT 
            id,
            titulo,
            autor,
            categoria,
            precio,
            stock,
            imagen_url
          FROM libros 
          WHERE is_active = TRUE
          ORDER BY categoria, titulo
        `);

        // Encabezado
        doc.fontSize(25).text('EL BUEN LIBRO', { align: 'center' });
        doc.fontSize(16).text('Reporte de Inventario', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown();
        
        // Resumen por categoría
        const categorias = {};
        libros.forEach(libro => {
          if (!categorias[libro.categoria]) {
            categorias[libro.categoria] = { total: 0, valor: 0 };
          }
          categorias[libro.categoria].total++;
          categorias[libro.categoria].valor += parseFloat(libro.precio) * libro.stock;
        });
        
        doc.fontSize(14).text('RESUMEN POR CATEGORÍA', { underline: true });
        doc.moveDown();
        
        Object.keys(categorias).forEach(categoria => {
          doc.fontSize(12).text(`${categoria}: ${categorias[categoria].total} libros - Valor: Bs ${categorias[categoria].valor.toFixed(2)}`);
        });
        
        doc.moveDown();
        
        // Tabla de inventario
        doc.fontSize(14).text('DETALLE DEL INVENTARIO', { underline: true });
        doc.moveDown();
        
        const tableTop = doc.y;
        const tableLeft = 50;
        
        doc.fontSize(10).text('ID', tableLeft, tableTop);
        doc.text('Título', tableLeft + 40, tableTop);
        doc.text('Autor', tableLeft + 200, tableTop);
        doc.text('Categoría', tableLeft + 300, tableTop);
        doc.text('Precio', tableLeft + 380, tableTop);
        doc.text('Stock', tableLeft + 430, tableTop);
        
        doc.moveTo(tableLeft, tableTop + 15)
          .lineTo(tableLeft + 480, tableTop + 15)
          .stroke();
        
        let y = tableTop + 25;
        libros.forEach(libro => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
          
          doc.fontSize(9).text(libro.id.toString(), tableLeft, y);
          doc.text(libro.titulo.substring(0, 30), tableLeft + 40, y);
          doc.text(libro.autor.substring(0, 20), tableLeft + 200, y);
          doc.text(libro.categoria, tableLeft + 300, y);
          doc.text(`Bs ${parseFloat(libro.precio).toFixed(2)}`, tableLeft + 380, y);
          
          // Color según stock
          if (libro.stock <= 5) {
            doc.fillColor('red').text(libro.stock.toString(), tableLeft + 430, y);
            doc.fillColor('black');
          } else if (libro.stock <= 10) {
            doc.fillColor('orange').text(libro.stock.toString(), tableLeft + 430, y);
            doc.fillColor('black');
          } else {
            doc.text(libro.stock.toString(), tableLeft + 430, y);
          }
          
          y += 20;
        });
        
        // Total de libros
        const totalLibros = libros.length;
        const totalStock = libros.reduce((sum, l) => sum + l.stock, 0);
        const valorTotal = libros.reduce((sum, l) => sum + (parseFloat(l.precio) * l.stock), 0);
        
        doc.moveDown();
        doc.fontSize(12).text(`Total de libros: ${totalLibros}`);
        doc.text(`Total en stock: ${totalStock} unidades`);
        doc.text(`Valor total del inventario: Bs ${valorTotal.toFixed(2)}`);
        
        // Pie de página
        doc.fontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 50, 750, { align: 'left' });
        doc.text('El Buen Libro - Sistema de Gestión', 0, 750, { align: 'center' });
        doc.text(`Página ${doc.bufferedPageRange().count}`, 0, 750, { align: 'right' });
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFGenerator;