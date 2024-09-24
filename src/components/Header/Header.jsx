import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Cart, Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../Assets/FOCALY - LOGOTYPE N.png'; 
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate('/search'); 
    };

    const handleLogoClick = () => {
        navigate('/'); 
    };

    return (
        <Navbar bg="light" expand="lg" fixed="top" style={{ padding: '1rem' }}> 
            <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer', marginLeft: '45px' }}>
                <img src={logo} alt="Focaly Logo" style={{ height: '80px' }} /> 
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                    <Nav.Link href="#cameras" className="mx-2" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem' }}>
                        Caméras Embarquées
                    </Nav.Link>
                    <Nav.Link href="#photo-devices" className="mx-2" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem' }}>
                        Appareils Photos
                    </Nav.Link>
                    <Nav.Link href="#drones" className="mx-2" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem' }}>
                        Drones
                    </Nav.Link>
                    <Nav.Link href="#accessories" className="mx-2" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem' }}>
                        Accessoires
                    </Nav.Link>
                    <Nav.Link href="#pack" className="mx-2" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem' }}>
                        Pack
                    </Nav.Link>
                    <Nav.Link href="#professional-packs" className="mx-2" style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem' }}>
                        Pack Pour les Professionnels
                    </Nav.Link>
                </Nav>
                <Nav className="d-flex align-items-center justify-content-start">
                    <Nav.Link onClick={handleSearchClick} className="mr-3" style={{ color: 'black', fontSize: '0.8rem' }}>
                        <Search size={20} /> 
                    </Nav.Link>
                    <Nav.Link href="#cart" className="ml-3" style={{ fontSize: '0.8rem'}}>
                        <Cart size={20} />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;