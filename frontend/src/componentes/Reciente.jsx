import React from 'react';
import { Link } from 'react-router-dom';
import { productosData } from './Ventaproducto';

const LibrosRecientes = () => {
    // Tomar solo los primeros 6 productos como "recientes"
    const librosRecientes = productosData.slice(0, 6);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    LIBROS <span className="text-orange-500">RECIENTES</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Descubre nuestras últimas novedades y lanzamientos exclusivos
                </p>
                <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {librosRecientes.map(libro => (
                    <div key={libro.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="relative">
                            <img
                                src={libro.imagen}
                                alt={libro.nombre}
                                className="w-full h-64 object-cover rounded-t-lg"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x400/FFE5CC/666666?text=Imagen+No+Disponible';
                                }}
                            />
                            <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">
                                Bs {libro.precio}
                            </span>
                            <span className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                                {libro.categoria}
                            </span>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2 text-gray-800">{libro.nombre}</h3>

                            <div className="flex justify-between items-center mb-3">
                                <span className={`text-sm px-2 py-1 rounded ${libro.stock > 10 ? 'bg-green-100 text-green-800' :
                                        libro.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {libro.stock > 0 ? `Stock: ${libro.stock}` : 'Agotado'}
                                </span>
                                <div className="flex items-center">
                                    <span className="text-yellow-500 mr-1">★</span>
                                    <span className="text-sm text-gray-600">{libro.rating}</span>
                                </div>
                            </div>

                            <Link
                                to="/manga"
                                className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 rounded font-semibold transition-colors duration-200"
                            >
                                Ver Detalles
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <Link
                    to="/manga"
                    className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                    Ver Todos los Libros
                </Link>
            </div>
        </div>
    );
};

export default LibrosRecientes;