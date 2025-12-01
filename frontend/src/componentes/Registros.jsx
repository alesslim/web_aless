import React from 'react';
import Encabezado from '../Encabezado';
import Footer from './Footer';
import logo3 from "../assets/img1.png";
import Opcion from './Opcion';

const Registros = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <Encabezado />
            <Opcion />


            <img
                src={logo3}
                alt="Decoración izquierda"
                className="absolute left-1 top-1/5 w-[400px] xl:w-96 lg:w-80 md:w-72 sm:w-60 h-auto opacity-100 z-20 object-cover"
            />
            <img
                src={logo3}
                alt="Decoración derecha"
                className="absolute right-1 top-1/5 w-[400px] xl:w-96 lg:w-80 md:w-72 sm:w-60 h-auto opacity-100 z-20 object-cover transform scale-x-[-1]"
            />


            <div className="w-full mt-2">
                <iframe
                    src="/login.html"
                    width="100%"
                    height="600px"
                    style={{ border: 'none', overflow: 'hidden' }}

                    className="z-10 relative"
                    scrolling="no"
                />
            </div>

            <Footer />
        </div>
    );
};

export default Registros;