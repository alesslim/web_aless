
import React from 'react';

import { Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Coleccion from './pages/Coleccion';
import Login from './pages/Login';
import ListProducto from './componentes/ListProducto';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/coleccion" element={<Coleccion />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productos" element={<ListProducto />} />
        </Routes>
    );
}

export default App;