import React, { useState } from 'react';

const Comentarios = () => {
    const [comentarios, setComentarios] = useState([
        {
            id: 1,
            nombre: "Pao",
            comentario: "¡Excelente servicio! Los mangas llegaron en perfecto estado y muy rápido.",
            fecha: "23 Nov 2025",

        },
        {
            id: 2,
            nombre: "leo",
            comentario: "¡Excelente servicio! Los mangas llegaron en perfecto estado y muy rápido.",
            fecha: "23 Nov 2024",

        },
    ]);

    const [nuevoComentario, setNuevoComentario] = useState("");

    const enviarComentario = () => {
        if (!nuevoComentario.trim()) {
            alert("Por favor, escribe un comentario");
            return;
        }

        const comentario = {
            id: Date.now(),
            nombre: "Usuario", // Puedes cambiar esto por un input de nombre si quieres
            comentario: nuevoComentario,
            fecha: new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),

        };

        // Agregar el nuevo comentario al principio del array
        setComentarios([comentario, ...comentarios]);

        // Limpiar el textarea
        setNuevoComentario("");

        alert("GRACIAS");
    };

    // Función para manejar la tecla Enter
    const manejarTeclaEnter = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarComentario();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl h-full flex flex-col w-100 border border-gray-900 border-black">
            <div className="bg-orange-500 text-white rounded-t-2xl px-6 py-4">
                <h3 className="text-xl font-bold p-2 text-center">Que opinas?</h3>
            </div>


            <div className="p-9 h-96 overflow-y-auto flex-grow">
                {comentarios
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .map(comentario => (
                        <div key={comentario.id} className="mb-4 last:mb-0">
                            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800 text-sm">
                                        {comentario.nombre}
                                    </h4>

                                </div>
                                <p className="text-gray-600 text-sm mb-1">
                                    {comentario.comentario}
                                </p>
                                <span className="text-xs text-gray-400 block text-right">
                                    {comentario.fecha}
                                </span>
                            </div>
                        </div>
                    ))}
            </div>

            <div className="px-4 pb-4 pt-4 mt-auto">
                <div className="bg-white border border-slate-200 grid grid-cols-6 gap-2 rounded-xl p-2 text-sm">
                    <h1 className="text-center text-slate-600 text-xl font-bold col-span-6">DEJA TU COMENTARIO</h1>
                    <textarea
                        placeholder="Escribe tu comentario..."
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        onKeyDown={manejarTeclaEnter}
                        className="bg-slate-100 text-slate-600 h-28 placeholder:text-slate-600 placeholder:opacity-50 border border-slate-200 col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-slate-600"
                    ></textarea>




                    <button
                        onClick={enviarComentario}
                        className="bg-slate-100 stroke-slate-600 border border-slate-200 col-span-2 flex justify-center rounded-lg p-2 duration-300 hover:border-slate-600 hover:text-white focus:stroke-blue-200 focus:bg-blue-400"
                    >
                        <svg fill="none" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"></path>
                            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M10.11 13.6501L13.69 10.0601"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Comentarios;