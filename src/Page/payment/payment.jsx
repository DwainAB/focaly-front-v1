import React, { useState, useEffect } from "react";
import { apiService } from "../../components/API/Api";
import { loadStripe } from '@stripe/stripe-js'; // Importer loadStripe
import "./payment.css";

const stripePromise = loadStripe('pk_test_51QFBXUKCe2DCFNsw7AdtEHll0dUAI8iacDaSZlYBqjeyTm6WF1ZOnyPiPMQvM594Pu0ZFZOd1mkso3yM95Aoyzwa00x5JYK6WH'); // Remplacez par votre clé publique Stripe

function Payment() {
    const [connexion, setConnexion] = useState(false);
    const [userConnected, setUserConnected] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [comment, setComment] = useState('');
    const [servicePoints, setServicePoints] = useState()
    const [postalCode, setPostalCode] = useState()
    const [deliveryMode, setDeliveryMode] = useState(); 
    const [selectedPoint, setSelectedPoint] = useState(null);

    
    const [orderSummary, setOrderSummary] = useState({
        totalPrice: '',
        endDate: '',
        startDate: '',
        daysDifference: ''
    });

    const [cartItems, setCartItems] = useState([]);

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
            endDate: item.endDate
        }));
        setCartItems(items);
    }, []);


    useEffect(()=>{
        fetchServicePoints();
        
    },[])

    useEffect(() => {
        if (deliveryMode === 'pickup') {
            setUserConnected((prevUser) => ({
                ...prevUser,
                address: '6 Allée Jean Prouvé',
                city: 'Clichy',
                zip_code: '92110',
            }));
            console.log('Mode de livraison: Pickup - Adresse mise à jour.');
        }
    }, [deliveryMode]);

    const fetchServicePoints = async (numericValue) => {
        const publicKey = 'b10c7273-c294-49f2-8e7b-af3543f8c28b';  // Remplacez par votre clé publique
        const privateKey = '93d4d18520264c57abf92c6dce14ef08'; // Remplacez par votre clé privée
    
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
            console.log('Requête réussie :', data);
            
            // Par exemple : Traitement des données ou mise à jour de l'état
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
    
        // Vérifier que l'entrée contient uniquement des chiffres et ne dépasse pas 5 caractères
        if (/^\d{0,5}$/.test(value)) {
            setPostalCode(value);
    
            // Appeler fetchServicePoints uniquement si le code postal est de 5 chiffres
            if (value.length === 5) {
                fetchServicePoints(Number(value));
            }
        }
    };
    
    
    

    const handlePayment = async (event) => {
        event.preventDefault();
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
            products: cartItems,
        };
    
        try {
            // Créer une session de paiement Stripe
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
            
            // Rediriger vers Stripe Checkout
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
        console.log('Point relais sélectionné:', point, userConnected);

    };
    
    

    return (
        <div>
            <h1 className="title-payment">Finaliser votre commande</h1>
            <div className="container-payment">
                <div className="container-login">
                    <h2>Connexion</h2>
                    <p>Soyez connecté à votre compte pour garder un historique de vos commandes</p>

                    {connexion ? (
                        <div className="container-form-connexion-payment">
                            <form onSubmit={handleSubmitLogin}>
                                <span onClick={() => setConnexion(false)} className="material-symbols-outlined">arrow_back_ios</span>
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
                    ) : (
                        <div className="container-button-connexion-payment">
                            <button onClick={() => setConnexion(true)}>Connexion</button>
                        </div>
                    )}
                </div>

                <div className="container-form-payment">
                    <h2 style={{ marginBottom: 50 }}>Information de livraison</h2>
                    <form onSubmit={handlePayment}>
                        <input 
                            type="text" 
                            name="firstname" 
                            value={userConnected.firstname || ""} 
                            required 
                            placeholder="Prénom" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="lastname" 
                            value={userConnected.lastname || ""} 
                            required 
                            placeholder="Nom" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="email" 
                            value={userConnected.email || ""} 
                            required 
                            placeholder="Email" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="phone" 
                            value={userConnected.phone || ""} 
                            required 
                            placeholder="Numéro" 
                            onChange={handleChange} 
                        />

                        <select name="deliveryMode" id="" onChange={(e) => setDeliveryMode(e.target.value)}>
                            <option value="">Méthode de livraison</option>
                            <option value="home">A domicile</option>
                            <option value="relay">Point relais</option>
                            <option value="pickup">Click & collect</option>
                        </select>
                        
                        {deliveryMode === "home" && (
                            <>
                                <input 
                                    type="text" 
                                    name="zip_code" 
                                    value={userConnected.zip_code || ""} 
                                    required 
                                    placeholder="Code postal" 
                                    onChange={handleChange} 
                                />
                                <input 
                                    type="text" 
                                    name="city" 
                                    value={userConnected.city || ""} 
                                    required 
                                    placeholder="Ville" 
                                    onChange={handleChange} 
                                />
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={userConnected.address || ""} 
                                    required 
                                    placeholder="Adresse" 
                                    onChange={handleChange} 
                                />
                            </>
                        )}

                        {deliveryMode === "relay" && (
                            <>
                                <input value={postalCode} type="text" placeholder="Code postal" onChange={handlePostalCodeChange} />
                                <div className="container-list-point">

                                    {Array.isArray(servicePoints) && servicePoints.length > 0 && (
                                        servicePoints.map((point) => (
                                            <div
                                            key={point.code}
                                            className={`container-point ${selectedPoint === point.code ? "selected-point" : ""}`}
                                            onClick={() => handlePointSelect(point)}
                                        >
                                            <p className="name-point">{point.name}</p>
                                            <p className="address-point">{point.house_number} {point.street} <br /> {point.postal_code} {point.city}</p>
                                        </div>
                                        ))
                                    )}
                                </div>

                            </>
                        )}

                        {deliveryMode === 'pickup' && (
                            <p>Votre colis sera disponible à l'adresse suivante : <br />
                                6 Allée jean prouvé, Clichy 
                            </p>
                        )}
                        <button type="submit">Payer</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Payment;
