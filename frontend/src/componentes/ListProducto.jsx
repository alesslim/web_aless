import React, { useState, useEffect } from 'react';
import { productoService } from '../services/api';

const ListProducto = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        categoria: 'Manga',
        stock: '',
        descripcion: ''
    });

    // Cargar productos desde el backend
    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productoService.getAll();
            setProductos(data);
        } catch (error) {
            console.error('Error cargando productos:', error);
            setError('No se pudieron cargar los productos. Verifica que el backend esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    // Agregar nuevo producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim() || !formData.precio || !formData.stock) {
            alert('❌ Por favor completa los campos requeridos');
            return;
        }

        try {
            const productoData = {
                ...formData,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
                imagen_url: formData.imagen_url || 'https://via.placeholder.com/300x400/FFE5CC/666666?text=Sin+Imagen'
            };

            await productoService.create(productoData);
            
            // Recargar productos
            await cargarProductos();
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                precio: '',
                categoria: 'Manga',
                stock: '',
                descripcion: '',
                imagen_url: ''
            });
            
            alert('✅ Producto agregado exitosamente');
        } catch (error) {
            console.error('Error agregando producto:', error);
            alert('❌ Error al agregar producto. Verifica la consola para más detalles.');
        }
    };

    // Eliminar producto
    const eliminarProducto = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
            return;
        }

        try {
            await productoService.delete(id);
            await cargarProductos();
            alert('✅ Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('❌ Error al eliminar producto');
        }
    };

    // Categorías disponibles
    const categorias = ['Manga', 'Comic', 'Novela', 'Terror', 'Suspenso', 'Acción', 'Otros'];

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-orange-500" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando productos desde la base de datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h5>❌ Error</h5>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={cargarProductos}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-3xl font-bold">Administración de Productos</h1>
                <span className="badge bg-primary fs-6">
                    {productos.length} productos en base de datos
                </span>
            </div>

            {/* Formulario para agregar nuevo producto */}
            <div className="card shadow-lg mb-4 border-0">
                <div className="card-header bg-gradient bg-success text-white">
                    <h4 className="mb-0">
                        <i className="bi bi-plus-circle me-2"></i>
                        Agregar Nuevo Producto
                    </h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: One Piece Vol. 101"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-bold">Precio (Bs) *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="150.00"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-bold">Categoría *</label>
                                <select
                                    className="form-select"
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                    required
                                >
                                    {categorias.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-bold">Stock *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="10"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-bold">URL de Imagen</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={formData.imagen_url || ''}
                                    onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label fw-bold">Descripción</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Descripción del producto..."
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                    rows="2"
                                />
                            </div>
                            <div className="col-md-12">
                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg w-100 py-2"
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Guardar Producto en Base de Datos
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="card shadow-lg border-0">
                <div className="card-header bg-gradient bg-primary text-white">
                    <h4 className="mb-0">
                        <i className="bi bi-list-ul me-2"></i>
                        Lista de Productos ({productos.length})
                    </h4>
                </div>
                <div className="card-body p-0">
                    {productos.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="text-muted">
                                <i className="bi bi-inbox fs-1"></i>
                                <h5 className="mt-3">No hay productos en la base de datos</h5>
                                <p>Agrega tu primer producto usando el formulario de arriba</p>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(producto => (
                                        <tr key={producto.id}>
                                            <td className="align-middle">
                                                <span className="badge bg-secondary">#{producto.id}</span>
                                            </td>
                                            <td className="align-middle">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={producto.imagen_url || producto.imagen}
                                                        alt={producto.nombre}
                                                        className="rounded me-3"
                                                        style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/50x70/FFE5CC/666666?text=IMG';
                                                        }}
                                                    />
                                                    <div>
                                                        <strong className="d-block">{producto.nombre}</strong>
                                                        <small className="text-muted">
                                                            {producto.descripcion ? producto.descripcion.substring(0, 50) + '...' : 'Sin descripción'}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                <span className={`badge ${getBadgeColor(producto.categoria)}`}>
                                                    {producto.categoria}
                                                </span>
                                            </td>
                                            <td className="align-middle">
                                                <span className="fw-bold text-success">
                                                    Bs {parseFloat(producto.precio).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="align-middle">
                                                <span className={`badge ${producto.stock > 10 ? 'bg-success' : producto.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                                    {producto.stock} unidades
                                                </span>
                                            </td>
                                            <td className="align-middle">
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => window.location.href = `/productos/editar/${producto.id}`}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => eliminarProducto(producto.id)}
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Estadísticas */}
            <div className="row mt-4">
                <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body text-center">
                            <h2 className="card-title">{productos.length}</h2>
                            <p className="card-text">Productos Totales</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body text-center">
                            <h2 className="card-title">{productos.filter(p => p.stock > 0).length}</h2>
                            <p className="card-text">Con Stock Disponible</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-white h-100">
                        <div className="card-body text-center">
                            <h2 className="card-title">{productos.filter(p => p.stock === 0).length}</h2>
                            <p className="card-text">Agotados</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-info text-white h-100">
                        <div className="card-body text-center">
                            <h2 className="card-title">
                                Bs {productos.reduce((sum, p) => sum + (parseFloat(p.precio) * p.stock), 0).toFixed(2)}
                            </h2>
                            <p className="card-text">Valor Total Inventario</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensaje de conexión */}
            <div className="alert alert-info mt-4">
                <i className="bi bi-database me-2"></i>
                <strong>Conectado a la base de datos MySQL</strong>
                <p className="mb-0">Los productos se están cargando desde: <code>el_buen_libro_db.productos</code></p>
            </div>
        </div>
    );
};

// Función para obtener color de badge según categoría
const getBadgeColor = (categoria) => {
    switch (categoria) {
        case 'Manga': return 'bg-danger';
        case 'Comic': return 'bg-primary';
        case 'Novela': return 'bg-success';
        case 'Terror': return 'bg-dark';
        case 'Suspenso': return 'bg-secondary';
        case 'Acción': return 'bg-warning text-dark';
        default: return 'bg-info';
    }
};
export default ListProducto;