import React from 'react';
import Encabezado from '../Encabezado';
import Opcion from './Opcion';
import Carrusel from './Carrusel';

export default function Menu(props) {
    return (
        <div>
            <Encabezado />
            <Opcion />
            <Carrusel />
        </div>
    );
}