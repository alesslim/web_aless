import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Encabezado from '../Encabezado';
import Opcion from '../componentes/Opcion';
import Registros from '../componentes/Registros';
import Footer from '../componentes/Footer';

const Login = () => {
    return (
        <div>

            <Registros />

        </div>
    );
};

export default Login;