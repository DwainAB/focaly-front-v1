import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Form } from 'react-bootstrap'; 
import './Packs.css';
import Drone1 from '../../Assets/Insta360.webp'; 
import DroneHover from '../../Assets/image.png'; 
import Drone2 from '../../Assets/image copy.png'; 
import DroneHover2 from '../../Assets/image copy.png'; 
import About from '../../components/About/About';

const Packs = () => {
    const products = [
        { id: 1, name: "Drone 1", price: 3.5, image: Drone1, hoverImage: DroneHover },
        { id: 2, name: "Drone 2", price: 4.0, image: Drone2, hoverImage: DroneHover2 },
        { id: 3, name: "Drone 3", price: 5.0, image: Drone1, hoverImage: DroneHover },
        { id: 4, name: "Drone 4", price: 3.0, image: DroneHover, hoverImage: DroneHover2 },
        { id: 5, name: "Drone 5", price: 4.5, image: Drone1, hoverImage: DroneHover },
        { id: 6, name: "Drone 6", price: 6.0, image: DroneHover, hoverImage: DroneHover2 },
    ];

    const [filter, setFilter] = useState('');
    const [showProducts, setShowProducts] = useState([]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredProducts = products.filter(product => {
        if (!filter) return true;
        return product.price <= parseFloat(filter);
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowProducts(filteredProducts.map((_, index) => index));
        }, 100);

        return () => clearTimeout(timeout); 
    }, [filteredProducts]);

    return (
        <div className="container my-4">
            <h1 className="text-center">Packs</h1>
            <Form.Group as={Row} className="my-4">
                <Form.Label column sm={2}>Filtrer par prix (max):</Form.Label>
                <Col sm={10}>
                    <Form.Control as="select" value={filter} onChange={handleFilterChange}>
                        <option value="">Tous les prix</option>
                        <option value="3.5">Jusqu'à 3,50 €</option>
                        <option value="4">Jusqu'à 4,00 €</option>
                        <option value="5">Jusqu'à 5,00 €</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Row>
                {filteredProducts.map((product, index) => (
                    <Col sm={12} md={4} key={product.id} className="mb-4">
                        <Link to={`/drone/${product.id}`} className="text-decoration-none">
                            <Card className={`drone-card ${showProducts.includes(index) ? 'show' : ''}`}>
                                <div className="image-container">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="card-img-top drone-image"
                                        onMouseEnter={(e) => e.currentTarget.src = product.hoverImage}
                                        onMouseLeave={(e) => e.currentTarget.src = product.image}
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Text className="text-center" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Je choisis mon drone <br />
                                        <span style={{ color: 'gray' }}>à partir de </span>
                                        <span style={{ color: 'gray' }}>{product.price.toFixed(2)} €</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
            <About /> 
        </div>
    );
};

export default Packs;