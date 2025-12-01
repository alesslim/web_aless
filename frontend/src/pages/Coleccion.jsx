// src/pages/Coleccion.jsx
import React from 'react';
import Encabezado from '../Encabezado';
import Opcion from '../componentes/Opcion';
import Ventaproducto from '../componentes/Ventaproducto';
import Footer from '../componentes/Footer';
import logo3 from "../assets/chibi2.png";
import logo4 from "../assets/extra4.png";

const Coleccion = () => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-orange-500">
            <Encabezado />
            <Opcion />
            <Ventaproducto />
            <Footer />
            <img
                src={logo3}
                alt="Decoración izquierda"
                className="fixed left-4 bottom-4 w-40 h-auto max-h-80 opacity-80 z-50 object-cover"
            />
            <img
                src={logo4}
                alt="Decoración derecha"
                className="fixed right-4 bottom-4 w-35 h-auto max-h-80 opacity-70 z-50 object-cover"
            />
        </div>
    );
};

export default Coleccion;