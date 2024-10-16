import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./ProductSelected.css";
import { apiService } from '../API/Api.jsx';
import Loader from "../Loader/Loader.jsx"; // Assurez-vous d'importer le composant Loader
import Calendar from "../Calendar/Calendar.jsx";

const ProductSelected = () => {
    const { id } = useParams();
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isIncludedOpen, setIsIncludedOpen] = useState(false);
    const descriptionRef = useRef(null);
    const includedRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [calendarData, setCalendarData] = useState({ range: [new Date(), new Date()], quantity: 1 }); 
    const [price, setPrice] = useState(0)
    const [isAddToCartEnabled, setIsAddToCartEnabled] = useState(false); 


    useEffect(() => {
        setLoading(true); // Commence le chargement
        apiService.getProductById(id)
            .then(data => {
                console.log('Données reçues du produit :', data);
                setProduct(data);
                setLoading(false); // Fin du chargement
            })
            .catch(error => {
                console.error('Erreur lors du chargement du produit :', error);
                setLoading(false); // Fin du chargement même en cas d'erreur
            });
    }, [id]);

    // Fonction pour ajuster la hauteur des sections
    const toggleSection = (ref, isOpenSetter, isOpen) => {
        const content = ref.current;
        if (!content) return;

        if (isOpen) {
            content.style.height = `${content.scrollHeight}px`;
        } else {
            content.style.height = "0px";
        }

        isOpenSetter(!isOpen);
    };

    useEffect(() => {
        if (descriptionRef.current) {
            if (isDescriptionOpen) {
                descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
            } else {
                descriptionRef.current.style.height = "0px";
            }
        }
    }, [isDescriptionOpen]);

    useEffect(() => {
        if (includedRef.current) {
            if (isIncludedOpen) {
                includedRef.current.style.height = `${includedRef.current.scrollHeight}px`;
            } else {
                includedRef.current.style.height = "0px";
            }
        }
    }, [isIncludedOpen]);

    // Affiche le loader si en cours de chargement
    if (loading) {
        return <Loader />; // Affiche le loader
    }

    // Si le produit n'est pas trouvé, afficher un message d'erreur
    if (!product) {
        return <p>Produit non trouvé</p>;
    }

    // Fonction pour gérer les données envoyées par le calendrier
    const handleDateChange = (data) => {
        setCalendarData(data);
        console.log("Données du calendrier :", data);
        const quantityAndDays = data.daysDifference * data.quantity;
        setPrice(quantityAndDays * product.price);
        
        setIsAddToCartEnabled(data.range[0] && data.range[1]);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
        const day = String(d.getDate()).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
        return `${year}-${month}-${day}`;
    };

    const handleAddToCart = () => {
        const cartItem = {
            product: product,
            price: price,
            quantity: calendarData.quantity,
            daysDifference: calendarData.daysDifference,
            startDate: formatDate(calendarData.range[0]),
            endDate: formatDate(calendarData.range[1]),
        };
    
        // Récupérer les articles existants dans le localStorage
        const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
        // Vérifier si le produit existe déjà et si les dates se chevauchent
        const isDateOverlap = existingCartItems.some(item => {
            return item.product.id === product.id && 
                ((cartItem.startDate >= item.startDate && cartItem.startDate <= item.endDate) || 
                (cartItem.endDate >= item.startDate && cartItem.endDate <= item.endDate) || 
                (cartItem.startDate <= item.startDate && cartItem.endDate >= item.endDate));
        });
    
        if (isDateOverlap) {
            alert("Les dates choisies se chevauchent avec un produit déjà dans le panier !");
            return; // Empêche l'ajout si les dates se chevauchent
        }
    
        // Vérifier si le produit existe déjà dans le panier
        const existingItemIndex = existingCartItems.findIndex(item => 
            item.product.id === product.id && 
            item.startDate === cartItem.startDate && 
            item.endDate === cartItem.endDate
        );
    
        if (existingItemIndex !== -1) {
            existingCartItems[existingItemIndex].quantity += cartItem.quantity;
            alert("La quantité de produit demandé a été modifiée !");
        } else {
            existingCartItems.push(cartItem);
            alert("Le produit a bien été ajouté à votre panier !");
        }
    
        // Enregistrer la nouvelle liste dans le localStorage
        localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    
        console.log("Produit ajouté au panier :", cartItem);
    };

    return (
        <div>
            <div className="container-product-selected">
                <div className="container-product-selected-img">
                    <img src={`http://localhost:8000/uploads/images/${product.images[0]}`} alt="product" />
                </div>

                <div className="container-product-selected-info">
                    <h1>{product.title}</h1>
                    <select>
                        <option value="">GoPro 11</option>
                        <option value="">GoPro 12</option>
                        <option value="">GoPro 13</option>
                    </select>
                    <p className="info-focaly">
                        Chez Focaly, vous recevez votre location chez vous 
                        <span style={{ color: "#F18989", fontWeight: "900" }}> 48h </span>
                        avant votre premier jour de location !
                    </p>

                    {/* Section Description */}
                    <div className='container-collapse' onClick={() => toggleSection(descriptionRef, setIsDescriptionOpen, isDescriptionOpen)}>
                        <p>Description du produit</p>
                        <p>{isDescriptionOpen ? "-" : "+"}</p>
                    </div>
                    <div className={`collapse-content-product ${isDescriptionOpen ? 'collapse-open' : ''}`} ref={descriptionRef}>
                        <p>{product.description}</p>
                    </div>

                    {product.include_in_retal !== null && (
                        <>
                            <div className='container-collapse' onClick={() => toggleSection(includedRef, setIsIncludedOpen, isIncludedOpen)}>
                                <p>Inclu dans la location</p>
                                <p>{isIncludedOpen ? "-" : "+"}</p>
                            </div>
                            <div className={`collapse-content-product ${isIncludedOpen ? 'collapse-open' : ''}`} ref={includedRef}>
                                <p>{product.include_in_retal}</p>
                            </div>
                        </>
                    )}

                    <Calendar onDateChange={handleDateChange} price={price} product={product} />
                    <button className={`btn-add-to-cart ${!isAddToCartEnabled ? 'disabled' : ''}`} onClick={handleAddToCart} disabled={!isAddToCartEnabled}>Ajouter au panier</button> 
                    </div>
            </div>
        </div>
    );
};

export default ProductSelected;
