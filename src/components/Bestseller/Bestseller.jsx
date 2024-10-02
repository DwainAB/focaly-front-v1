import React, { useState, useEffect } from 'react';
import './Bestseller.css';
import { apiService } from '../API/Api';

const Bestseller = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await apiService.getProducts();
                const limitedProducts = allProducts.slice(0, 5);
                setProducts(limitedProducts);
                console.log(limitedProducts);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bestseller">
            <h1 className='title-bestseller'>Nos meilleurs locations</h1>

            <div className="container-product-bestseller">
                {products.map((product, index) => (
                    <div key={index} className="product-bestseller">
                        <img src={`http://localhost:8000/uploads/images/${product.images[0]}`} alt={product.name} />
                        <p>{product.title} dès <br />{product.price.toFixed(2)}€/jours</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bestseller;