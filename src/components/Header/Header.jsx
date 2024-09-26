// Exemple de mise à jour de Header.jsx
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
        <Navbar bg="light" expand="lg" fixed="top" className="py-3">
            <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer', marginLeft: '45px' }}>
                <img src={logo} alt="Focaly Logo" style={{ height: '80px' }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                    {[
                        { name: 'Caméras Embarquées', path: '/cameras' },
                        { name: 'Appareils Photos', path: '/AppareilsPhotos' },
                        { name: 'Drones', path: '/drones' },
                        { name: 'Accessoires', path: '/Accessoires' },
                        { name: 'Pack', path: '/Packes' },
                        { name: 'Pour les Professionnels', path: '/Professionnels' }
                    ].map((item, index) => (
                        <Nav.Link 
                            key={index} 
                            onClick={() => navigate(item.path)} 
                            className="mx-2" 
                            style={{ fontWeight: 'bold', color: 'black', fontSize: '1rem' }}>
                            {item.name}
                        </Nav.Link>
                    ))}
                </Nav>
                <Nav className="d-flex align-items-center">
                    <Nav.Link onClick={handleSearchClick} className="mx-3" style={{ color: 'black', fontSize: '0.8rem' }}>
                        <Search size={20} />
                    </Nav.Link>
                    <Nav.Link href="Cart" className="mx-3" style={{ fontSize: '0.8rem' }}>
                        <Cart size={20} />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;