import React from 'react';
import { useNavigate } from 'react-router-dom';

const Botones = () => {
    const navigate = useNavigate();

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <button className="btn btn-danger btn-lg fw-bold px-4 py-2">
                            MANGA
                        </button>

                        <button className="btn btn-primary btn-lg fw-bold px-4 py-2">
                            COMIC
                        </button>

                        <button className="btn btn-success btn-lg fw-bold px-4 py-2">
                            NOVELAS
                        </button>

                        <button className="btn btn-dark btn-lg fw-bold px-4 py-2">
                            TERROR
                        </button>

                        <button className="btn btn-secondary btn-lg fw-bold px-4 py-2">
                            SUSPENSO
                        </button>
                        <button className="btn btn-warning btn-lg fw-bold px-4 py-2">
                            ACCIÓN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Botones; 