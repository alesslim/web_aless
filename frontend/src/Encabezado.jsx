import React, { useState } from 'react';
import { TiSocialFacebook } from "react-icons/ti";
import { SlSocialInstagram } from "react-icons/sl";
import { SlSocialYoutube } from "react-icons/sl";
import { FaShoppingCart } from "react-icons/fa";
import logo1 from './assets/Principal.png';
import { FaCircleUser } from "react-icons/fa6";
import { Link, Outlet } from 'react-router-dom';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

const Encabezado = (args) => {

    const [isOpen, setIsOpen] = useState(true);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar {...args} expand="md" style={{ backgroundColor: 'orange' }}>
                <NavbarBrand href="/">
                    <img src={logo1} alt="Logo" style={{ height: '80px', width: 'auto' }} />
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />

                <div>
                    <Navbar {...args} expand="md" style={{ backgroundColor: 'white' }}>
                        <Nav className="me-auto" navbar style={{ display: 'flex', alignItems: 'center' }}>
                            <NavItem>
                                <Link to="/" style={{ cursor: 'pointer', color: 'black', fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', padding: '8px 16px' }}>
                                    INICIO
                                </Link>
                            </NavItem>

                            <NavItem>
                                <NavLink href="https://www.facebook.com/?locale=es_LA" target="_blank" style={{ color: 'black' }}>
                                    <TiSocialFacebook size={30} />
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://www.youtube.com/" target="_blank" style={{ color: 'black' }}>
                                    <SlSocialYoutube size={30} />
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://www.instagram.com/" target="_blank" style={{ color: 'black' }}>
                                    <SlSocialInstagram size={28} />
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <NavbarToggler onClick={toggle} />
                        <Collapse isOpen={isOpen} navbar>
                        </Collapse>

                        <Nav navbar className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
                        </Nav>
                    </Navbar>
                </div>

                <Nav navbar className="ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
                    <NavItem>
                        <Link to="/productos" className="text-decoration-none">
                            <button
                                className="btn btn-warning d-flex align-items-center gap-1 px-5 py-1 fw-bold bg-danger m-5
                                "
                            >
                                PRODUCTOS
                            </button>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/manga" style={{ cursor: 'pointer', color: 'black', textDecoration: 'none', padding: '20px' }}>
                            <FaShoppingCart size={30} />
                        </Link>
                    </NavItem>
                    <NavItem className='p-5'>
                        <Link to="/login">
                            <button
                                className="btn btn-warning d-flex align-items-center gap-1 px-4 py-1 fw-bold"
                            >
                                <FaCircleUser size={40} />
                            </button>
                        </Link>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
};

export default Encabezado;