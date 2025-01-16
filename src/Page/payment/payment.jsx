import React, { useState, useEffect } from "react";
import { apiService } from "../../components/API/Api";
import { loadStripe } from '@stripe/stripe-js';
import "./payment.css";
import { MapPin } from "lucide-react";

const stripePromise = loadStripe('pk_test_51KtTuWGOv8pHQz3BLVWDm8uCUvyOPWl00UeL5ZD36txGonrHlmZaEELO4r9daxURXTghwiIWkstgp24aE8HbdnVS00wa34VPEJ');

function Payment() {
    const [userConnected, setUserConnected] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [comment, setComment] = useState('');
    const [servicePoints, setServicePoints] = useState();
    const [postalCode, setPostalCode] = useState();
    const [deliveryMode, setDeliveryMode] = useState();
    const [selectedPoint, setSelectedPoint] = useState(null);

    const [orderSummary, setOrderSummary] = useState({
        totalPrice: '',
        endDate: '',
        startDate: '',
        daysDifference: ''
    });

    const [cartItems, setCartItems] = useState([]);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };


    
    useEffect(() => {
        const getUserConnected = JSON.parse(localStorage.getItem("user"));
        const getSummaryOrder = JSON.parse(localStorage.getItem("orderSummary"));
        const getComment = localStorage.getItem('comment');

        if (getComment) {
            setComment(getComment);
        }

        if (getSummaryOrder) {
            setOrderSummary({
                totalPrice: getSummaryOrder.totalPrice,
                daysDifference: getSummaryOrder.daysDifference,
                startDate: getSummaryOrder.startDate,
                endDate: getSummaryOrder.endDate
            });
        }

        if (getUserConnected) {
            setUserConnected(getUserConnected);
            setEmail('');
            setPassword('');
        }

        const getCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const items = getCartItems.map(item => ({
            id: item.product.id,
            title: item.product.title,
            images: item.product.images,
            price: item.price,
            quantity: item.quantity,
            startDate: item.startDate,
            endDate: item.endDate,
            priceUnit : parseFloat(item.product.price * orderSummary.daysDifference )
        }));
        setCartItems(items);
    }, []);

    useEffect(() => {
        if (deliveryMode === 'Click & Collect') {
            setUserConnected((prevUser) => ({
                ...prevUser,
                address: '6 Allée Jean Prouvé',
                city: 'Clichy',
                zip_code: '92110',
            }));
        }
    }, [deliveryMode]);

    const fetchServicePoints = async (numericValue) => {
        const publicKey = 'b10c7273-c294-49f2-8e7b-af3543f8c28b';
        const privateKey = '93d4d18520264c57abf92c6dce14ef08';

        try {
            const response = await fetch(`https://servicepoints.sendcloud.sc/api/v2/service-points?postal_code=${numericValue}&country=FR`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${publicKey}:${privateKey}`),
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error('Erreur lors de la récupération des points relais:', response.status, response.statusText);
                return;
            }

            const data = await response.json();
            setServicePoints(data || []);
        } catch (error) {
            console.error('Erreur lors de la récupération des points relais:', error);
        }
    };

    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await apiService.login(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUserConnected(response.user);
            setEmail('');
            setPassword('');
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserConnected((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handlePostalCodeChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,5}$/.test(value)) {
            setPostalCode(value);
            if (value.length === 5) {
                fetchServicePoints(Number(value));
            }
        }
    };

    const handlePayment = async (event) => {
        event.preventDefault();

            // Vérification des champs obligatoires
        if (!userConnected.firstname || !userConnected.lastname || !userConnected.email || !userConnected.phone) {
            alert("Veuillez remplir tous les champs d'information personnelle");
            return;
        }

        // Vérification de la méthode de livraison
        if (!deliveryMode) {
            alert("Veuillez choisir une méthode de livraison");
            return;
        }

        // Vérification des champs spécifiques selon la méthode de livraison
        if (deliveryMode === "A domicile") {
            if (!userConnected.address || !userConnected.zip_code || !userConnected.city) {
                alert("Veuillez remplir tous les champs d'adresse");
                return;
            }
        }

        if (deliveryMode === "Point relais" && !selectedPoint) {
            alert("Veuillez sélectionner un point relais");
            return;
        }

        const order = {
            clientId: userConnected.id ? userConnected.id : null,
            firstname: userConnected.firstname,
            lastname: userConnected.lastname,
            email: userConnected.email,
            phone: userConnected.phone,
            address: userConnected.address,
            zipCode: userConnected.zip_code,
            city: userConnected.city,
            totalPrice: orderSummary.totalPrice,
            rentalDays: orderSummary.daysDifference,
            startDate: orderSummary.startDate,
            endDate: orderSummary.endDate,
            comment: comment ? comment : null,
            delivery_mode: deliveryMode,
            products: cartItems,
        };

        try {
            const response = await fetch('https://focaly-service.in/public/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur lors de la création de la session : ${JSON.stringify(errorData)}`);
            }

            const session = await response.json();
            const stripe = await stripePromise;

            const { error } = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (error) {
                console.error("Erreur lors de la redirection vers Stripe Checkout :", error);
            }
        } catch (error) {
            console.error("Erreur lors du traitement du paiement :", error);
        }
    };

    const handlePointSelect = (point) => {
        setSelectedPoint(point.code);
        setUserConnected((prevUser) => ({
            ...prevUser,
            address: `${point.house_number} ${point.street}`,
            zip_code: point.postal_code,
            city: point.city
        }));
    };

    return (
        <div>
            <h1 className="title-payment">Finaliser votre commande</h1>
            <div className="container-payment">
                {!userConnected.id ? (
                    <div className="container-login">
                        <h2>Connexion</h2>
                        <p>Soyez connecté à votre compte pour garder un historique de vos commandes</p>
                        <div className="container-form-connexion-payment">
                            <form onSubmit={handleSubmitLogin}>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    name="email"
                                    type="email"
                                    value={email}
                                />
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mot de passe"
                                    name="password"
                                    type="password"
                                    value={password}
                                />
                                <button type="submit">Connexion</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="order-summary-container">
                        <h2 className="summary-title">Résumé de votre commande</h2>
                        <div className="order-details">
                            <div className="products-list">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="product-item">
                                        <div className="product-info">
                                            <div className="product-header">
                                                <h4>{item.title}</h4>
                                                <span className="price">{item.price.toFixed(2)}€</span>
                                                </div>
                                            <div className="product-details">
                                                <small>
                                                    Qté: {item.quantity} × {item.priceUnit.toFixed(2)}€ | 
                                                    Location: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-footer">
                                <div className="order-total">
                                    <p><strong>Total: {orderSummary.totalPrice}€</strong> ({orderSummary.daysDifference} jours)</p>
                                </div>
                                {userConnected && (
                                    <div className="delivery-address">
                                        <small>
                                            <strong>Livraison:</strong> {userConnected.address}, {userConnected.zip_code} {userConnected.city}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="container-form-payment">
                    <div className="form-header">
                        <h2>Information de livraison</h2>
                    </div>
                    <form onSubmit={handlePayment} className="delivery-form">
                        <div className="form-grid">
                            <input
                                type="text"
                                name="firstname"
                                value={userConnected.firstname || ""}
                                required
                                placeholder="Prénom"
                                onChange={handleChange}
                                className="form-input"
                            />
                            <input
                                type="text"
                                name="lastname"
                                value={userConnected.lastname || ""}
                                required
                                placeholder="Nom"
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-grid">
                            <input
                                type="text"
                                name="email"
                                value={userConnected.email || ""}
                                required
                                placeholder="Email"
                                onChange={handleChange}
                                className="form-input"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={userConnected.phone || ""}
                                required
                                placeholder="Numéro"
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <select 
                            name="deliveryMode" 
                            onChange={(e) => setDeliveryMode(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Méthode de livraison</option>
                            <option value="A domicile">A domicile</option>
                            <option value="Point relais">Point relais</option>
                            <option value="Click & Collect">Click & collect</option>
                        </select>

                        {deliveryMode === "A domicile" && (
                            <div className="address-inputs">
                                <div className="form-grid">
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={userConnected.zip_code || ""}
                                        required
                                        placeholder="Code postal"
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        value={userConnected.city || ""}
                                        required
                                        placeholder="Ville"
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={userConnected.address || ""}
                                    required
                                    placeholder="Adresse"
                                    onChange={handleChange}
                                    className="form-input full-width"
                                />
                            </div>
                        )}

                        {deliveryMode === "Point relais" && (
                            <>
                                <input
                                    value={postalCode}
                                    type="text"
                                    placeholder="Code postal"
                                    onChange={handlePostalCodeChange}
                                    className="form-input"
                                />
                                <div className="container-list-point">
                                    {Array.isArray(servicePoints) && servicePoints.length > 0 && (
                                        servicePoints.map((point) => (
                                            <div
                                                key={point.code}
                                                className={`container-point ${selectedPoint === point.code ? "selected-point" : ""}`}
                                                onClick={() => handlePointSelect(point)}
                                            >
                                                <p className="name-point">{point.name}</p>
                                                <p className="address-point">
                                                    {point.house_number} {point.street} <br />
                                                    {point.postal_code} {point.city}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {deliveryMode === "Click & Collect" && (
                            <div className="click-collect-box">
                                <div className="click-collect-content">
                                    <MapPin className="click-collect-icon" />
                                    <div>
                                        <h3>Point de retrait Click & Collect</h3>
                                        <p>6 Allée Jean Prouvé</p>
                                        <p>92110 Clichy</p>
                                        <small>
                                            Votre commande sera disponible à cette adresse après confirmation de paiement.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="submit-button">
                            Payer {orderSummary.totalPrice}€
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Payment;