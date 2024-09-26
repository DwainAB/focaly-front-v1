import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { EnvelopeFill } from 'react-bootstrap-icons';
import './Professionnels.css';

const Professionnels = () => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <Container className={`my-5 professionnals-container ${fadeIn ? 'fade-in' : ''}`}>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">Professionnels</h2>
                    <p className="text-center mb-4">
                        Contactez-nous pour toutes vos demandes de location de matériel ! 
                        Nous sommes là pour vous aider à choisir le meilleur équipement pour vos projets.
                    </p>
                    <Form className="contact-form">
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control type="text" placeholder="Votre nom" required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email <EnvelopeFill className="ms-2" /></Form.Label>
                                    <Form.Control type="email" placeholder="Votre email" required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="formMessage" className="mt-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Votre message" required />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Envoyer
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Professionnels;