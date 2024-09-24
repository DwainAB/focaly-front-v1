import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AppareilsPhotos.css';
import { Card, Row, Col, Form } from 'react-bootstrap';
import Gopro from '../../Assets/image.png'; 
import DJI from '../../Assets/image copy.png'; 

const AppareilsPhotos = () => {
    const [showCards, setShowCards] = useState(false); // État pour gérer l'affichage des cartes
    const products = [
        { id: 1, name: "Appareil Photo 1", price: 5.0, image: Gopro, hoverImage: DJI },
        { id: 2, name: "Appareil Photo 2", price: 6.0, image: DJI, hoverImage: Gopro },
        // Ajoute d'autres appareils photo si nécessaire
    ];

    const [filter, setFilter] = useState('');

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredProducts = products.filter(product => {
        if (!filter) return true;
        return product.price <= parseFloat(filter);
    });

    // Utiliser useEffect pour afficher les cartes après le chargement
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCards(true);
        }, 100); // Délai pour afficher les cartes

        return () => clearTimeout(timer); // Nettoyer le timer
    }, []);

    return (
        <div className="container my-4">
            <h1 className="text-center">Appareils Photos</h1>
            <Form.Group as={Row} className="my-4">
                <Form.Label column sm={2}>Filtrer par prix (max):</Form.Label>
                <Col sm={10}>
                    <Form.Control as="select" value={filter} onChange={handleFilterChange}>
                        <option value="">Tous les prix</option>
                        <option value="5">Jusqu'à 5,00 €</option>
                        <option value="6">Jusqu'à 6,00 €</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Row>
                {filteredProducts.map(product => (
                    <Col sm={12} md={4} key={product.id} className="mb-4">
                        <Link to={`/appareil/${product.id}`} className="text-decoration-none">
                            <Card className={`camera-card ${showCards ? 'show' : ''}`}>
                                <div className="image-container">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="card-img-top camera-image"
                                        onMouseEnter={(e) => e.currentTarget.src = product.hoverImage}
                                        onMouseLeave={(e) => e.currentTarget.src = product.image}
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Text className="text-center" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Je choisis mon appareil <br />
                                        <span style={{ color: 'gray' }}>à partir de </span>
                                        <span style={{ color: 'gray' }}>{product.price.toFixed(2)} €</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AppareilsPhotos;