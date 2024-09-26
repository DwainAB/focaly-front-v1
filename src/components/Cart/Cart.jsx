import React from 'react';
import { Container, Row, Col, Button, Image, Card, Form } from 'react-bootstrap';
import './Cart.css';  // Le fichier CSS personnalisé

const Cart = () => {
  const items = [
    {
      id: 1,
      name: 'Caméra Insta360',
      price: 350,
      quantity: 1,
      image: '../../Assets/Insta360.webp', 
    },
    {
      id: 2,
      name: 'Drone DJI Mavic Air 2',
      price: 1200,
      quantity: 1,
      image: '../../Assets/product.jpg', 
    },
  ];

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Container className="cart-page">
      <h2 className="cart-title">Mon Panier</h2>
      <Row>
        <Col md={8}>
          {items.map(item => (
            <Card className="cart-item" key={item.id}>
              <Row className="align-items-center">
                <Col md={3}>
                  <Image src={item.image} fluid rounded />
                </Col>
                <Col md={5}>
                  <h5>{item.name}</h5>
                  <p>Prix unitaire: {item.price} €</p>
                </Col>
                <Col md={2}>
                  <Form.Control as="select" defaultValue={item.quantity}>
                    {[1, 2, 3, 4, 5].map(qty => (
                      <option key={qty} value={qty}>{qty}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button variant="danger">Retirer</Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
        <Col md={4}>
          <Card className="cart-summary">
            <h5>Récapitulatif</h5>
            <p>Total: <strong>{total} €</strong></p>
            <Button variant="success" size="lg" block>
              Passer à la caisse
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;