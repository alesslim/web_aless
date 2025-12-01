import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
const LibrosRecientes = ({ onVerTodos, }) => {

    const librosRecientes = [
        {
            id: 1,
            titulo: "Fairytail Vol. 45",
            imagen: "https://m.media-amazon.com/images/I/81EIdomF4FL._AC_UF1000,1000_QL80_.jpg",
            precio: "Bs 150",
            categoria: "Manga"
        },
        {
            id: 2,
            titulo: "Heartstopper Tomo 4",
            imagen: "https://encantalibros.com/wp-content/uploads/2020/12/9789877475876.jpg",
            precio: "Bs 180",
            categoria: "Comic"
        },
        {
            id: 3,
            titulo: "Bajo la Misma Estrella",
            imagen: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1636903987-51xwkWYYgkL._SL500_.jpg?crop=1xw:0.987xh;center,top&resize=980:*",
            precio: "Bs 165",
            categoria: "Novela"
        },
        {
            id: 4,
            titulo: "Attack on Titan Vol. 34",
            imagen: "https://www.akiracomics.com/media/products/113553/113553-0-med.jpg",
            precio: "Bs 200",
            categoria: "Manga"
        }
    ];

    return (
        <div className="bg-orange-100 rounded-2xl shadow-2xl p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    LIBROS MÁS RECIENTES
                </h2>
                <p className="text-gray-600">
                    Libros mas recientes de nuestra pagina
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {librosRecientes.map(libro => (
                    <div key={libro.id} className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-orange-200">
                        <img
                            src={libro.imagen}
                            alt={libro.titulo}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-gray-800 text-sm flex-1 mr-2">
                                    {libro.titulo}
                                </h3>
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                    {libro.categoria}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-orange-600">
                                    {libro.precio}
                                </span>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 r sm:flex-row justify-center items-center gap-4 relative z-30">
                <Link to='/coleccion'>
                    <button

                        className="bg-gradient-to-r bg-danger to-red-500 hover:from-red-500 hover:to-red-600 text-black font-extrabold px-8 py-4 rounded-xl text-xl transition duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                        VER MÁS
                    </button>
                </Link>
            </div>

        </div>
    );
};

export default LibrosRecientes;