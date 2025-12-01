import React from 'react';
import logo3 from "../assets/chibi2.png";


const Detalle = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            <img
                src={logo3}
                alt="Decoración izquierda"
                className="fixed left-4 bottom-4 w-40 h-auto max-h-80 opacity-80 z-50 object-cover"
            />

            {/* Imagen derecha - SIN SOMBRA Y ENCIMA DE TODO */}
            <img
                src={logo3}
                alt="Decoración derecha"
                className="fixed right-4 bottom-4 w-40 h-auto max-h-80 opacity-80 z-50 object-cover"
            />
        </div>
    );
};

export default Detalle;