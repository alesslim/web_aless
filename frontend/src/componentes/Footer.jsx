
import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import logo2 from "../assets/extra5.gif"
import { PiStarDuotone } from "react-icons/pi";

function Footer() {
    return (
        <>
            <div className="bg-gray-50 min-h-20 w-full flex md:flex-row flex-col justify-around items-start p-10">
                <div className="p-5 ">
                    <ul>
                        <p className="text-gray-800 font-bold text-3xl pb-6">
                            EL BUEN<span className="text-orange-600">LIBRO</span>
                        </p>
                        <div className="flex gap-6 pb-5">

                            <FaInstagram size={50} className="text-2xl cursor-pointer hover:text-yellow-600" />
                            <SiGithub size={50} className="text-2xl cursor-pointer hover:text-blue-600" />
                            <FaLinkedin size={50} className="text-2xl cursor-pointer hover:text-blue-600" />
                            <FaYoutube size={50} className="text-2xl cursor-pointer hover:text-red-600" />

                        </div>
                        <div>
                            <img
                                src={logo2}
                                alt="Logo"
                                style={{ width: '400px', height: '400px' }}
                            />
                        </div>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-2xl pb-2">Integrantes:</p>
                        <li className="flex items-center gap-2 text-gray-500 text-md pb-1 font-semibold hover:text-blue-600 cursor-pointer">
                            <PiStarDuotone /> Paola Tania Gutierrez Apaza
                        </li>
                        <li className="flex items-center gap-2 text-gray-500 text-md pb-1 font-semibold hover:text-blue-600 cursor-pointer">
                            <PiStarDuotone />
                        </li>
                        <li className="flex items-center gap-2 text-gray-500 text-md pb-1 font-semibold hover:text-blue-600 cursor-pointer">
                            <PiStarDuotone />
                        </li>

                    </ul>
                </div>



                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-2xl pb-4">Productos</p>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Libros
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Mangas
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Novelas
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Educación
                        </li>
                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-2xl pb-4">Ayuda</p>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Quienes somos
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Politica de privacidad
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Politica de Cookies
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Envios
                        </li>

                    </ul>
                </div>
                <div className="p-5">
                    <ul>
                        <p className="text-gray-800 font-bold text-2xl pb-4">Contactar</p>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Contacto
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Ubicación
                        </li>
                        <li className="text-gray-500 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
                            Librerias
                        </li>

                    </ul>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center   bg-gray-50">
                <h1 className=" text-gray-500 font-semibold">
                    © 2025 DERESCHOS RESERVADOS | PROGRAMACIÓN WEBIII
                    <span className="hover:text-blue-400 font-semibold cursor-pointer">

                    </span>
                </h1>
            </div>
        </>
    );
}

export default Footer;