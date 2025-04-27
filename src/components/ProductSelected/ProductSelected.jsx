import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./ProductSelected.css";
import { apiService } from '../API/Api.jsx';
import Loader from "../Loader/Loader.jsx";
import Calendar from "../Calendar/Calendar.jsx";
import ProductsService from '../../Services/Products.jsx';

const ProductSelected = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isIncludedOpen, setIsIncludedOpen] = useState(false);
    const descriptionRef = useRef(null);
    const includedRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [groupProducts, setGroupProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calendarData, setCalendarData] = useState({ range: [new Date(), new Date()], quantity: 1 });
    const [price, setPrice] = useState(0);
    const [isAddToCartEnabled, setIsAddToCartEnabled] = useState(false);
    const [includeInRetail, setIncludeInRetail] = useState(null)

    useEffect(() => {
        const fetchProductAndGroup = async () => {
            try {
                setLoading(true);
                // Récupérer d'abord le produit
                const productData = await ProductsService.getProductById(id);
                setProduct(productData);
                setIncludeInRetail(productData.include_in_retail) 
                
                if(Array.isArray(productData.include_in_retail)){
                    if(productData.include_in_retail.length > 0){
                        setIncludeInRetail(productData.include_in_retail)
                    }else{
                        setIncludeInRetail(null)
                        
                    }
                }
                           
                
                if (Array.isArray(productData.groups)) {
                    
                    if (productData.groups.length > 0) {
                        const productsData = await apiService.getProductsByCategory(productData.category);
                        
                        const sameGroupProducts = productsData.filter(p => 
                            Array.isArray(p.groups) && p.groups.some(g => productData.groups.includes(g))
                        );
                        setGroupProducts(sameGroupProducts);
                    }
                } else {
                    console.log("Pas de groups ou format invalide:", productData.groups);
                    setGroupProducts([]);
                }
        
                setLoading(false);

            } catch (error) {
                console.error('Erreur lors du chargement:', error);
                setLoading(false);
            }
        };

        fetchProductAndGroup();
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

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        navigate(`/product/${selectedProductId}`);
    };

    const handleDateChange = (data) => {
        setCalendarData(data);
        
        const daysDifference = Math.floor(data.daysDifference);
        const quantityAndDays = daysDifference * data.quantity;
        
        setPrice(quantityAndDays * product.price);
        setIsAddToCartEnabled(data.range[0] && data.range[1]);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
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
    
        const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
        const isDateOverlap = existingCartItems.some(item => {
            return item.product.id === product.id && 
                ((cartItem.startDate >= item.startDate && cartItem.startDate <= item.endDate) || 
                (cartItem.endDate >= item.startDate && cartItem.endDate <= item.endDate) || 
                (cartItem.startDate <= item.startDate && cartItem.endDate >= item.endDate));
        });
    
        if (isDateOverlap) {
            alert("Les dates choisies se chevauchent avec un produit déjà dans le panier !");
            return;
        }
    
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
    
        localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    };

    if (loading) {
        return <Loader />;
    }

    if (!product) {
        return <p>Produit non trouvé</p>;
    }
    
    

    return (
        <div className='global-product-selected'>
            <div className="container-product-selected">
                <div className="container-product-selected-img">
                    <img src={product.images[0].path_url} alt="product" />
                </div>

                <div className="container-product-selected-info">
                    <h1>{product.title}</h1>
                    
                    {groupProducts.length > 0 && (
                        <select 
                            value={product.id} 
                            onChange={handleProductChange}
                        >
                            {groupProducts.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                    )}

                    <p className="info-focaly">
                        Chez Focaly, vous recevez votre location chez vous 
                        <span style={{ color: "#F18989", fontWeight: "900" }}> 48h </span>
                        avant votre premier jour de location !
                    </p>

                    <div className='container-collapse' onClick={() => toggleSection(descriptionRef, setIsDescriptionOpen, isDescriptionOpen)}>
                        <p>Description du produit</p>
                        <p>{isDescriptionOpen ? "-" : "+"}</p>
                    </div>
                    <div className={`collapse-content-product ${isDescriptionOpen ? 'collapse-open' : ''}`} ref={descriptionRef}>
                        <p>{product.description}</p>
                    </div>

                    {includeInRetail !== null  && (
                        <>
                            <div className='container-collapse' onClick={() => toggleSection(includedRef, setIsIncludedOpen, isIncludedOpen)}>
                                <p>Inclu dans la location</p>
                                <p>{isIncludedOpen ? "-" : "+"}</p>
                            </div>
                            <div className={`collapse-content-product ${isIncludedOpen ? 'collapse-open' : ''}`} ref={includedRef}>
                                {/* {includeInRetail.map((iir) =>
                                    <p>- {iir}</p>
                                )} */}
                                <p>Vous pouvez ajouter des accessoires supplémentaires en cliquant sur "Étape Suivante".</p>
                            </div>
                        </>
                    )}

                    <Calendar onDateChange={handleDateChange} price={price} product={product} productId={product.id} />
                    <button 
                        className={`btn-add-to-cart ${!isAddToCartEnabled ? 'disabled' : ''}`} 
                        onClick={handleAddToCart} 
                        disabled={!isAddToCartEnabled}
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductSelected;