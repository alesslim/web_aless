import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Opcion = () => {
    const navigate = useNavigate();

    // Función para filtrar por categoría
    const filtrarPorCategoria = (categoria) => {
        // Navegar a la página de colección con el parámetro de categoría
        navigate(`/coleccion?categoria=${categoria.toLowerCase()}`);
    };

    return (
        <div>
            <ul className="nav nav-tabs bg-black justify-content-center">
                <li className="nav-item">
                    <button
                        className="nav-link text-white"
                        onClick={() => filtrarPorCategoria('acción')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        ACCIÓN
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className="nav-link text-white"
                        onClick={() => filtrarPorCategoria('comic')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        COMIC
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className="nav-link text-white"
                        onClick={() => filtrarPorCategoria('novela')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        NOVELAS
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className="nav-link text-white"
                        onClick={() => filtrarPorCategoria('manga')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        MANGA
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className="nav-link text-white"
                        onClick={() => filtrarPorCategoria('suspenso')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        SUSPENSO
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className="nav-link text-white"
                        onClick={() => filtrarPorCategoria('terror')}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        TERROR
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Opcion;