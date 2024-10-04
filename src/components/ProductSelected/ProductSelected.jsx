import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./ProductSelected.css";
import { apiService } from '../API/Api.jsx';
import Loader from "../Loader/Loader.jsx"; // Assurez-vous d'importer le composant Loader

const ProductSelected = () => {
    const { id } = useParams();
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isIncludedOpen, setIsIncludedOpen] = useState(false);
    const descriptionRef = useRef(null);
    const includedRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // État pour le chargement

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

                    {/* Section Inclu dans la location */}
                    {product.include_in_retal !== null && (
                        <>
                            <div className='container-collapse' onClick={() => toggleSection(includedRef, setIsIncludedOpen, isIncludedOpen)}>
                                <p>Inclu dans la location</p>
                                <p>{isIncludedOpen ? "-" : "+"}</p>
                            </div>
                            <div className={`collapse-content-product ${isIncludedOpen ? 'collapse-open' : ''}`} ref={includedRef}>
                                <p>Voici ce qui est inclus dans la location : chargeurs, accessoires, et autres équipements nécessaires.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductSelected;
