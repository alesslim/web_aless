

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CardVentas = () => {
    // Estado para los productos
    const [productos, setProductos] = useState([
        {
            id: 1,
            nombre: "Fairytail Volumen",
            precio: 150,
            descripcion: "Laptop para gaming con RTX 4060, 16GB RAM, 1TB SSD",
            imagen: "https://m.media-amazon.com/images/I/81EIdomF4FL._AC_UF1000,1000_QL80_.jpg",
            categoria: "Manga",
            stock: 15,

        },
        {
            id: 2,
            nombre: "Heartstopper",
            precio: 180,
            descripcion: "Teléfono inteligente con cámara triple 108MP y 5G",
            imagen: "https://encantalibros.com/wp-content/uploads/2020/12/9789877475876.jpg",
            categoria: "Comic",
            stock: 25,

        },
        {
            id: 3,
            nombre: "Bajo la misma Estrella",
            precio: 165,
            descripcion: "Auriculares inalámbricos con cancelación de ruido",
            imagen: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1636903987-51xwkWYYgkL._SL500_.jpg?crop=1xw:0.987xh;center,top&resize=980:*",
            categoria: "Audio",
            stock: 30,
            rating: 4.7
        },
        {
            id: 4,
            nombre: "Smart Watch Pro",
            precio: 349,
            descripcion: "Reloj inteligente con monitor de salud y GPS",
            imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            categoria: "Wearables",
            stock: 20,
            rating: 4.4
        },
        {
            id: 5,
            nombre: "Tablet Drawing",
            precio: 599,
            descripcion: "Tablet para diseño y dibujo con stylus incluido",
            imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            categoria: "Tecnología",
            stock: 12,
            rating: 4.6
        },
        {
            id: 6,
            nombre: "Cámara Profesional",
            precio: 1500,
            descripcion: "Cámara DSLR con lente 24-70mm para fotografía profesional",
            imagen: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            categoria: "Fotografía",
            stock: 8,
            rating: 4.8
        }
    ]);

    const [carrito, setCarrito] = useState([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');

    // Filtrar productos por categoría
    const productosFiltrados = categoriaFiltro === 'Todas'
        ? productos
        : productos.filter(producto => producto.categoria === categoriaFiltro);

    // Agregar al carrito
    const agregarAlCarrito = (producto) => {
        setCarrito(prevCarrito => {
            const existe = prevCarrito.find(item => item.id === producto.id);
            if (existe) {
                return prevCarrito.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prevCarrito, { ...producto, cantidad: 1 }];
        });
    };

    // Eliminar del carrito
    const eliminarDelCarrito = (id) => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
    };

    // Calcular total
    const totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    // Categorías únicas
    const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">

                        <div className="d-flex align-items-center">
                            <span className="badge bg-danger me-2">
                                Carrito: {carrito.reduce((sum, item) => sum + item.cantidad, 0)}
                            </span>
                            <span className="fw-bold fs-5">Total: Bs {totalCarrito}</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Filtrar por Categoría</h5>
                            <div className="btn-group flex-wrap">
                                {categorias.map(categoria => (
                                    <button
                                        key={categoria}
                                        className={`btn ${categoriaFiltro === categoria ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setCategoriaFiltro(categoria)}
                                    >
                                        {categoria}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="row g-4">
                {productosFiltrados.map(producto => (
                    <div key={producto.id} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="card h-100 shadow-sm hover-shadow">
                            <div className="position-relative">
                                <img
                                    src={producto.imagen}
                                    className="card-img-top"
                                    alt={producto.nombre}
                                    style={{ background: "green", height: "380px", objectFit: "cover" }}
                                />
                                <span className="position-absolute top-0 end-0 badge bg-red-400 m-1" >
                                    Bs {producto.precio}
                                </span>
                                <span className="position-absolute top-0 start-0 badge bg-info m-2">
                                    {producto.categoria}
                                </span>
                            </div>

                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title">{producto.nombre}</h5>
                                    <div className="d-flex align-items-center">
                                        <span className="text-warning me-1">★</span>
                                        <small>{producto.rating}</small>
                                    </div>
                                </div>

                                <p className="card-text flex-grow-1 text-muted">
                                    {producto.descripcion}
                                </p>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <small className={`badge ${producto.stock > 10 ? 'bg-success' : producto.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                        {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                                    </small>
                                    <small className="text-muted">ID: {producto.id}</small>
                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() => agregarAlCarrito(producto)}
                                    disabled={producto.stock === 0}
                                >
                                    {producto.stock > 0 ? ' Agregar al Carrito' : 'Agotado'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Carrito de Compras */}
            {carrito.length > 0 && (
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card shadow-lg">
                            <div className="card-header bg-primary text-white">
                                <h4 className="mb-0"> Tu Carrito de Compras</h4>
                            </div>
                            <div className="card-body">
                                {carrito.map(item => (
                                    <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={item.imagen}
                                                alt={item.nombre}
                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                className="rounded me-3"
                                            />
                                            <div>
                                                <h6 className="mb-1">{item.nombre}</h6>
                                                <small className="text-muted">Cantidad: {item.cantidad}</small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className="fw-bold me-3">
                                                Bs{item.precio * item.cantidad}
                                            </span>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => eliminarDelCarrito(item.id)}
                                            >

                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <h5 className="mb-0">Total a Pagar:</h5>
                                    <h4 className="mb-0 text-success">Bs {totalCarrito}</h4>
                                </div>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                                    <button className="btn btn-outline-secondary me-md-2">
                                        📝 Seguir Comprando
                                    </button>
                                    <button className="btn btn-success">
                                        💳 Proceder al Pago
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
                                    <h4 className="text-info">${totalCarrito}</h4>
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

export default CardVentas;