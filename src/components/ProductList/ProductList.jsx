import React, { useState, useEffect } from 'react';
import "./ProductList.css"
import { Link } from 'react-router-dom';
import { apiService } from '../API/Api.jsx';

const ProductList = ({ category }) => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        apiService.getProductsByCategory(category)
            .then(data => setProducts(data))
            .catch(error => console.error('Erreur lors du chargement des produits :', error));
    }, [category]);

    //Permet d'afficher un titre en fonction de la catégorie trouvé
    const getTitle = (category) => {
        switch (category) {
            case 'onBoardCamera':
                return 'Caméra embarquées';
            case 'photo':
                return 'Appareils photos';
            case 'drones':
                return 'Drones';
            case 'accessories':
                return 'Accessoires';
            case 'pack':
                return 'Packs';
            case 'professionnels':
                return 'Pour les professionnels';
            default:
                return category;
        }
    };

    //Si category = "professionnels tu affiches ça"
  if (category === "professionnels") {
    return (
      <div className='container-form-professional'>
        <h1>{getTitle(category)}</h1>
        <h2>Nous sommes à votre écoute</h2>
        <div className='container-form'>
            <form className="contact-form">
            <div className='top-form-professional'>
                <input type="text" name="name" placeholder='Nom' required />
                <input type="email" name="email" placeholder='Email' required />
            </div>
            <div>
                <textarea name="message" rows="4" placeholder='Message' required></textarea>
            </div>
            <button type="submit">Envoyer</button>
            </form>
        </div>
      </div>
    );
  }

  //Si products contient rien, affiche ça
  if (!products) {
    return <p>Catégorie non trouvée</p>;
  }

  console.log(products);

  //Si category contient quelque chose et est différents de professionnels affiche ça
  return (
    <div>
      <h1 className='title-collection'>{getTitle(category)}</h1>
      {!Array.isArray(products) || products.length === 0 ? (
        <p className='text-center my-5 fs-3 fw-bold'>Aucun produit n'a été trouvé dans cette catégorie.</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <Link to={product.url} key={product.id}>
              <div className="product">
                <img src={`http://localhost:8000/uploads/images/${product.images[0]}`} alt={product.title} className="product-image" />
                <div className="info-product">
                    <h2 className="title-product">{product.title}</h2>
                    <p className="price-product">A partir de {product.price}€</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;