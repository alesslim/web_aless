import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GiCardboardBox } from "react-icons/gi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { productoService, carritoService } from '../services/api';

const Ventaproducto = () => {
    const location = useLocation();
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [orden, setOrden] = useState('');
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [loading, setLoading] = useState(true);
    const [carritoLoading, setCarritoLoading] = useState(false);

    // Cargar productos y carrito desde el backend
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                
                // Cargar productos
                const productosData = await productoService.getAll();
                setProductos(productosData);
                
                // Cargar carrito desde la base de datos
                const carritoData = await carritoService.getCart();
                
                // Convertir formato de BD a formato de frontend
                const carritoFormateado = carritoData.map(item => ({
                    id: item.producto_id,
                    carrito_id: item.carrito_id,
                    nombre: item.nombre,
                    precio: item.precio,
                    imagen_url: item.imagen_url,
                    categoria: item.categoria,
                    cantidad: item.cantidad
                }));
                
                setCarrito(carritoFormateado);
                
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Detectar categoría desde la URL
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const categoriaFromURL = urlParams.get('categoria');

        if (categoriaFromURL) {
            const categoriaFormateada = categoriaFromURL.charAt(0).toUpperCase() + categoriaFromURL.slice(1);
            setCategoriaFiltro(categoriaFormateada);
        }
    }, [location.search]);

    // Filtrar productos por categoría
    const productosFiltrados = categoriaFiltro === 'Todas'
        ? productos
        : productos.filter(producto => producto.categoria === categoriaFiltro);

    // Función para buscar productos
    const productosBusqueda = terminoBusqueda
        ? productosFiltrados.filter(producto =>
            producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
        )
        : productosFiltrados;

    // Función para ordenar productos
    const productosOrdenados = orden
        ? [...productosBusqueda].sort((a, b) => {
            switch (orden) {
                case 'precio-asc':
                    return a.precio - b.precio;
                case 'precio-desc':
                    return b.precio - a.precio;
                case 'nombre-asc':
                    return a.nombre.localeCompare(b.nombre);
                case 'nombre-desc':
                    return b.nombre.localeCompare(a.nombre);
                default:
                    return 0;
            }
        })
        : productosBusqueda;

    // Agregar al carrito (GUARDA EN BASE DE DATOS)
    const agregarAlCarrito = async (producto) => {
        try {
            setCarritoLoading(true);
            
            // Guardar en la base de datos
            await carritoService.addToCart(producto.id, 1);
            
            // Recargar carrito desde la BD para obtener el carrito_id
            const carritoData = await carritoService.getCart();
            const carritoFormateado = carritoData.map(item => ({
                id: item.producto_id,
                carrito_id: item.carrito_id,
                nombre: item.nombre,
                precio: item.precio,
                imagen_url: item.imagen_url,
                categoria: item.categoria,
                cantidad: item.cantidad
            }));
            
            setCarrito(carritoFormateado);
            
            alert(`✅ ${producto.nombre} agregado al carrito`);
        } catch (error) {
            console.error('Error agregando al carrito:', error);
            alert('❌ Error al agregar al carrito. Intenta de nuevo.');
        } finally {
            setCarritoLoading(false);
        }
    };

    // Eliminar del carrito (ELIMINA DE BASE DE DATOS)
    const eliminarDelCarrito = async (id) => {
        try {
            setCarritoLoading(true);
            
            // Buscar el item en el carrito para obtener carrito_id
            const itemEnCarrito = carrito.find(item => item.id === id);
            
            if (!itemEnCarrito) {
                alert('❌ Producto no encontrado en el carrito');
                return;
            }
            
            // Si tenemos el carrito_id, eliminar de la BD
            if (itemEnCarrito.carrito_id) {
                await carritoService.removeFromCart(itemEnCarrito.carrito_id);
            }
            
            // Actualizar estado local
            setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
            
            alert('✅ Producto eliminado del carrito');
        } catch (error) {
            console.error('Error eliminando del carrito:', error);
            alert('❌ Error al eliminar del carrito');
        } finally {
            setCarritoLoading(false);
        }
    };

    // Ajustar cantidad en carrito (ACTUALIZA BASE DE DATOS)
    const ajustarCantidad = async (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            // Si cantidad es 0, eliminar del carrito
            eliminarDelCarrito(id);
            return;
        }

        try {
            setCarritoLoading(true);
            
            // Buscar el item en el carrito para obtener carrito_id
            const itemEnCarrito = carrito.find(item => item.id === id);
            
            if (!itemEnCarrito) {
                alert('❌ Producto no encontrado en el carrito');
                return;
            }
            
            // Si tenemos el carrito_id, actualizar en BD
            if (itemEnCarrito.carrito_id) {
                await carritoService.updateQuantity(itemEnCarrito.carrito_id, nuevaCantidad);
            }
            
            // Actualizar estado local
            setCarrito(prevCarrito =>
                prevCarrito.map(item =>
                    item.id === id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
            );
        } catch (error) {
            console.error('Error actualizando cantidad:', error);
            alert('❌ Error al actualizar cantidad');
        } finally {
            setCarritoLoading(false);
        }
    };

    // Calcular total
    const totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const cantidadEnCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    // Categorías únicas
    const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-orange-500" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando productos y carrito...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Header con búsqueda y carrito */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-3 rounded" style={{ backgroundColor: '#ffc86fff' }}>
                        {/* Búsqueda */}
                        <div className="flex-grow-1" style={{ maxWidth: '650px' }}>
                            <div className="input-group">
                                <span className="input-group-text" style={{ backgroundColor: '#FD7E14', borderColor: '#FD7E14' }}>
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar productos..."
                                    value={terminoBusqueda}
                                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                                    style={{ borderColor: '#FD7E14' }}
                                />
                            </div>
                        </div>

                        {/* Filtro por categoría */}
                        <div>
                            <select
                                className="form-select"
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                                style={{ borderColor: '#FD7E14', minWidth: '150px' }}
                            >
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Ordenamiento */}
                        <div>
                            <select
                                className="form-select"
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                style={{ borderColor: '#FD7E14', minWidth: '180px' }}
                            >
                                <option value="">Filtro</option>
                                <option value="nombre-asc">Nombre: A-Z</option>
                                <option value="nombre-desc">Nombre: Z-A</option>
                            </select>
                        </div>

                        {/* Carrito */}
                        <div
                            className={`d-flex align-items-center p-2 rounded cursor-pointer ${carrito.length > 0 ? 'bg-warning' : 'bg-light'}`}
                            onClick={() => carrito.length > 0 && setMostrarCarrito(!mostrarCarrito)}
                            style={{
                                cursor: carrito.length > 0 ? 'pointer' : 'default',
                                border: carrito.length > 0 ? '2px solid #FFC107' : '2px solid #dee2e6',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {carritoLoading ? (
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            ) : (
                                <GiCardboardBox size={30} className="me-2" />
                            )}
                            <div className="d-flex flex-column">
                                <span className="fw-bold">
                                    {cantidadEnCarrito} {cantidadEnCarrito === 1 ? 'item' : 'items'}
                                </span>
                                <span className="fw-bold text-success">Bs {totalCarrito}</span>
                            </div>
                            {carrito.length > 0 && (
                                <span className="ms-2 badge bg-danger">{cantidadEnCarrito}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="container-fluid py-6">
                <div className="row justify-content-center">
                    <div className="col-xxl-10 col-xl-11 col-12">
                        <div className="row justify-content-center g-4">
                            {productosOrdenados.map(producto => (
                                <div key={producto.id} className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 mb-4">
                                    <div className="card h-100 shadow-sm hover-shadow mx-3" style={{
                                        backgroundColor: '#FFE5CC',
                                        maxWidth: '290px'
                                    }}>
                                        <div className="position-relative">
                                            <img
                                                src={producto.imagen_url || producto.imagen}
                                                className="card-img-top"
                                                alt={producto.nombre}
                                                style={{
                                                    background: "lightgreen",
                                                    height: "220px",
                                                    objectFit: "cover",
                                                    borderRadius: '0.375rem 0.375rem 0 0'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x400/FFE5CC/666666?text=Sin+Imagen';
                                                }}
                                            />
                                            <span className="position-absolute top-0 end-0 badge m-1" style={{ backgroundColor: '#FD7E14' }}>
                                                Bs {producto.precio}
                                            </span>
                                            <span className="position-absolute top-0 start-0 badge m-2" style={{ backgroundColor: '#FFA94D', color: '#000' }}>
                                                {producto.categoria}
                                            </span>
                                        </div>

                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title" style={{ color: '#333' }}>{producto.nombre}</h5>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <small className={`badge ${producto.stock > 10 ? 'bg-success' : producto.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                                    {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                                                </small>
                                                <small className="text-muted">ID: {producto.id}</small>
                                            </div>

                                            <button
                                                className="btn w-100"
                                                onClick={() => agregarAlCarrito(producto)}
                                                disabled={producto.stock === 0 || carritoLoading}
                                                style={{
                                                    backgroundColor: producto.stock === 0 || carritoLoading ? '#CCCCCC' : '#FD7E14',
                                                    borderColor: producto.stock === 0 || carritoLoading ? '#CCCCCC' : '#FD7E14',
                                                    color: 'white'
                                                }}
                                            >
                                                {carritoLoading ? 'Procesando...' : 
                                                 producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal del Carrito */}
            {mostrarCarrito && carrito.length > 0 && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: '#FD7E14', color: 'white' }}>
                                <h5 className="modal-title">TU CARRITO DE COMPRAS</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setMostrarCarrito(false)}
                                    disabled={carritoLoading}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {carrito.map(item => (
                                    <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-3">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                className="rounded me-3"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/60x60/FFE5CC/666666?text=IMG';
                                                }}
                                            />
                                            <div>
                                                <h6 className="mb-1">{item.nombre}</h6>
                                                <small className="text-muted">Bs {item.precio} c/u</small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            {/* Contador de cantidad */}
                                            <div className="d-flex align-items-center me-3">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => ajustarCantidad(item.id, item.cantidad - 1)}
                                                    disabled={carritoLoading}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-3 fw-bold">{item.cantidad}</span>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => ajustarCantidad(item.id, item.cantidad + 1)}
                                                    disabled={carritoLoading}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="fw-bold me-3">
                                                Bs {item.precio * item.cantidad}
                                            </span>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => eliminarDelCarrito(item.id)}
                                                disabled={carritoLoading}
                                            >
                                                <FaRegTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <h5 className="mb-0">Total a Pagar:</h5>
                                    <h4 className="mb-0 text-success">Bs {totalCarrito}</h4>
                                </div>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                                    <button 
                                        className="btn btn-outline-secondary me-md-2" 
                                        onClick={() => setMostrarCarrito(false)}
                                        disabled={carritoLoading}
                                    >
                                        Seguir Comprando
                                    </button>
                                    <button 
                                        className="btn btn-success d-flex align-items-center gap-2"
                                        disabled={carritoLoading}
                                    >
                                        {carritoLoading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Cargando...</span>
                                                </div>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <LiaMoneyBillWaveSolid size={20} />
                                                Proceder al Pago
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Estadísticas */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-md-3">
                                    <h4 className="text-primary">{productos.length}</h4>
                                    <p className="text-muted mb-0">Productos Totales</p>
                                </div>
                                <div className="col-md-3">
                                    <h4 className="text-success">{productos.filter(p => p.stock > 0).length}</h4>
                                    <p className="text-muted mb-0">Disponibles</p>
                                </div>
                                <div className="col-md-3">
                                    <h4 className="text-warning">{carrito.length}</h4>
                                    <p className="text-muted mb-0">En Carrito</p>
                                </div>
                                <div className="col-md-3">
                                    <h4 className="text-info">Bs {totalCarrito}</h4>
                                    <p className="text-muted mb-0">Valor Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ventaproducto;