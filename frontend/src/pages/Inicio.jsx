import React from 'react';
import { useNavigate } from 'react-router-dom';
import Encabezado from '../Encabezado';
import Carrusel from '../componentes/Carrusel';
import Opcion from '../componentes/Opcion';
import Footer from '../componentes/Footer';
import Comentarios from '../componentes/Comentarios';
import LibrosRecientes from '../componentes/LibrosRecientes';
import logo4 from "../assets/extra4.png";
import logo3 from "../assets/chibi2.png";
import Botones from '../componentes/Botones';
import Molde from '../componentes/Molde';

const Inicio = () => {
    const navigate = useNavigate();

    const irAVentasProductos = () => navigate('/ventaproducto');
    const irAManga = () => navigate('/manga');

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-orange-500">
            <Encabezado />
            <Opcion />
            <Molde />


            <div className="w-full px-4 py-2">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">

                        <div className="lg:col-span-3 pr-2">
                            <div className="bg-white rounded-xl shadow-xl p-5">
                                <div className="h-[400px] mb-4">
                                    <Carrusel />
                                </div>
                                <div className="mt-4">
                                    <Botones />
                                </div>
                            </div>
                        </div>


                        <div className="lg:col-span-1 pl-2">
                            <Comentarios />
                        </div>
                    </div>
                </div>
            </div>


            <div className="w-full px-4 mb-12 mt-6">
                <div className="max-w-7xl mx-auto">
                    <LibrosRecientes
                        onVerTodos={irAVentasProductos}
                        onVerManga={irAManga}
                    />
                </div>
            </div>

            <Footer />


            <img
                src={logo3}
                alt="Decoración izquierda"
                className="fixed left-4 bottom-4 w-40 h-auto max-h-80 opacity-80 z-50 object-cover"
            />
            <img
                src={logo4}
                alt="Decoración derecha"
                className="fixed right-4 bottom-4 w-30 h-auto max-h-80 opacity-80 z-50 object-cover"
            />
        </div>
    );
};

export default Inicio;