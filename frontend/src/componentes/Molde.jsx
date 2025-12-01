import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Molde = () => {
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Buscar productos - versión mejorada
    const buscarProductos = (termino) => {
        if (!termino.trim()) {
            setResultadosBusqueda([]);
            setMostrarResultados(false);
            return;
        }

        // Si estamos en la página de colección, buscar en el DOM
        if (location.pathname === '/coleccion') {
            const elementosProducto = document.querySelectorAll('.card');
            const resultados = [];

            elementosProducto.forEach(elemento => {
                const nombreElemento = elemento.querySelector('.card-title');
                if (nombreElemento && nombreElemento.textContent.toLowerCase().includes(termino.toLowerCase())) {
                    const precioElemento = elemento.querySelector('.badge');
                    const imagenElemento = elemento.querySelector('.card-img-top');

                    resultados.push({
                        id: nombreElemento.textContent,
                        nombre: nombreElemento.textContent,
                        precio: precioElemento ? parseFloat(precioElemento.textContent.replace('Bs ', '')) || 0 : 0,
                        imagen: imagenElemento ? imagenElemento.src : ''
                    });
                }
            });

            setResultadosBusqueda(resultados);
        } else {
            // Si no estamos en colección, redirigir allí
            navigate('/coleccion');
        }

        setMostrarResultados(true);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            buscarProductos(terminoBusqueda);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [terminoBusqueda]);

    const irAlProducto = (producto) => {
        if (location.pathname === '/coleccion') {
            const elementos = document.querySelectorAll('.card-title');
            elementos.forEach(elemento => {
                if (elemento.textContent === producto.nombre) {
                    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    elemento.closest('.card').style.boxShadow = '0 0 0 3px #FD7E14';
                    setTimeout(() => {
                        elemento.closest('.card').style.boxShadow = '';
                    }, 2000);
                }
            });
        }
        setMostrarResultados(false);
        setTerminoBusqueda('');
    };

    return (
        <div className="relative">
            <div className="container-fluid py-4">
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-3 rounded" style={{ backgroundColor: '#ffc86fff' }}>

                            <div className="flex-grow-1 position-relative" style={{ maxWidth: '650px' }}>
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
                                        onFocus={() => terminoBusqueda && setMostrarResultados(true)}
                                        style={{ borderColor: '#FD7E14' }}
                                    />
                                    {terminoBusqueda && (
                                        <button
                                            className="input-group-text"
                                            onClick={() => {
                                                setTerminoBusqueda('');
                                                setMostrarResultados(false);
                                            }}
                                            style={{ backgroundColor: '#FD7E14', borderColor: '#FD7E14', cursor: 'pointer' }}
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>

                                {/* Resultados */}
                                {mostrarResultados && resultadosBusqueda.length > 0 && (
                                    <div className="position-absolute top-100 start-0 end-0 bg-white border border-orange-300 rounded shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                                        {resultadosBusqueda.map((producto) => (
                                            <div
                                                key={producto.id}
                                                className="p-3 border-bottom border-orange-100 hover:bg-orange-50 cursor-pointer"
                                                onClick={() => irAlProducto(producto)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={producto.imagen}
                                                        alt={producto.nombre}
                                                        className="rounded me-3"
                                                        style={{ width: '40px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1 text-dark">{producto.nombre}</h6>
                                                        <small className="text-muted">Bs {producto.precio}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {mostrarResultados && terminoBusqueda && resultadosBusqueda.length === 0 && (
                                    <div className="position-absolute top-100 start-0 end-0 bg-white border border-orange-300 rounded shadow-lg mt-1 z-50 p-3">
                                        <p className="text-center text-muted mb-0">
                                            {location.pathname === '/coleccion'
                                                ? 'No se encontraron productos'
                                                : 'Redirigiendo a colección...'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Molde;