import React from 'react';
import "./Produits.css";
import productImg from "../../Assets/product.jpg"; 
import Instaimg from "../../Assets/Insta360.webp"; 
import { Link } from 'react-router-dom';

const ProductList = () => {
    const products = [
        { id: 1, name: "DJI Mini 3", imgSrc: productImg, price: "3.67", url: "/produit/1" },
        { id: 2, name: "DJI Mini 3", imgSrc: Instaimg, price: "2.75", url: "/produit/2" },
        { id: 3, name: "DJI Mini 3", imgSrc: productImg, price: "4.39", url: "/produit/3" },
        { id: 4, name: "DJI Mini 3", imgSrc: Instaimg, price: "3.99", url: "/produit/4" },
        { id: 5, name: "DJI Mini 3", imgSrc: productImg, price: "5.00", url: "/produit/5" },
    ];

    return (
        <div className="produits-container">
            <h1>Nos Meilleures Locations</h1>
            <div className="produits-grid">
                {products.map((product) => (
                    <Link key={product.id} to={product.url} className="produit-card">
                        <img src={product.imgSrc} alt={product.name} />
                        <div className="produit-info">
                            <h2>{product.name}</h2>
                            <p className="produit-price">À partir de {product.price}€</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;