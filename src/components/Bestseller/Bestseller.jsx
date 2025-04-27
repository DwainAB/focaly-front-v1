import React, { useState, useEffect } from 'react';
import './Bestseller.css';
import { apiService } from '../API/Api';
import { Link } from 'react-router-dom';
import ProductsService from '../../Services/Products';

const Bestseller = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await apiService.getProducts();
                const productBestseller = await ProductsService.getProduct(5);
                setProducts(productBestseller);
                console.log('test', productBestseller);
                
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
                    <Link key={index} to={`/product/${product.id}`}>
                        <div className="product-bestseller">
                            <img src={product.mainImage} alt={product.name} />
                            <p>{product.name} dès <br />{product.price}€/jours</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Bestseller;