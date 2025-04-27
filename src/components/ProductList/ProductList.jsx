import React, { useState, useEffect } from 'react';
import "./ProductList.css";
import { Link } from 'react-router-dom';
import { apiService } from '../API/Api.jsx';
import Loader from "../Loader/Loader.jsx";
import ProductsService from '../../Services/Products.jsx';

const ProductList = ({ category }) => {
   const [products, setProducts] = useState([]); // Produits sans groupe
   const [groups, setGroups] = useState([]);
   const [groupedProducts, setGroupedProducts] = useState([]); // Produits avec groupe
   const [loading, setLoading] = useState(true);

   useEffect(() => {
       setLoading(true);
       
       Promise.all([
           apiService.getGroupsByCategory(category),
           category !== "accessories" ? 
               ProductsService.getProductByCategory(category) : 
               apiService.getAccessories()
       ])
       .then(([groupsData, productsData]) => {
           setGroups(groupsData);
           
           // Séparer les produits avec et sans groupes
           const productsWithGroups = productsData.filter(product => 
               product.groups && product.groups.length > 0
           );
           const productsWithoutGroups = productsData.filter(product => 
               !product.groups || product.groups.length === 0
           );
           
           setGroupedProducts(productsWithGroups);
           setProducts(productsWithoutGroups);
           setLoading(false);
       })
       .catch(error => {
           console.error('Erreur:', error);
           setLoading(false);
       });
   }, [category]);

   const getGroupMinPriceProduct = (groupId) => {
       // Filtrer les produits qui appartiennent à ce groupe
       const productsInGroup = groupedProducts.filter(product => 
            product.groups.includes(parseInt(groupId))
        );

       console.log(groupId, productsInGroup);
       

       if (productsInGroup.length === 0) return null;

       // Convertir les prix de string en nombre et trouver le minimum
       return productsInGroup.reduce((minProduct, currentProduct) => {
           const minPrice = parseFloat(minProduct.price);
           const currentPrice = parseFloat(currentProduct.price);
           return currentPrice < minPrice ? currentProduct : minProduct;
       }, productsInGroup[0]);
   };

   const getTitle = (category) => {
       switch (category) {
           case 'a55ddd8a-a7f4-401a-a631-1c7db03733b8':
               return 'Caméra embarquées';
           case 'b2a067e2-813d-48be-9e09-8bff2b85b90c':
               return 'Appareils photo';
           case '02c9ee6c-242a-4175-9c37-24d6cbc56dba':
               return 'Drones';
           case '76e1d025-90a0-4185-9af2-f4d3465a463a':
               return 'Accessoires';
           case 'pack':
               return 'Packs';
           case 'professionnels':
               return 'Pour les professionnels';
           default:
               return category;
       }
   };

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

   if (loading) {
       return <Loader />;
   }

   if (!products || products.length === 0) {
       return <p className='text-center my-5 fs-3 fw-bold'>Aucun produit n'a été trouvé dans cette catégorie.</p>;
   }

   return (
       <div>
           <h1 className='title-collection'>{getTitle(category)}</h1>

           <div className="product-list">
                {/* Affichage des groupes avec leur produit le moins cher */}
                {groups && groups.length > 0 && groups.map((group) => {
                    const cheapestProduct = getGroupMinPriceProduct(group.id);
                    if (!cheapestProduct) return null;

                    return (
                        <Link to={`/product/${cheapestProduct.id}`} key={group.id}>
                            <div className="product">
                                <img 
                                    src={`https://focaly-service.in/public/uploads/images/${cheapestProduct.images[0]}`} 
                                    alt={group.name} 
                                    className="product-image" 
                                />
                                <div className="info-product" style={{maxWidth: "350px"}}>
                                    <h2 className="title-product-collection">{group.name}</h2>
                                    <p className="price-product-collection">À partir de {cheapestProduct.price}€</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* Affichage uniquement des produits sans groupe */}
                {products.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id}>
                        <div className="product">
                            <img 
                                src={product.mainImage} 
                                alt={product.name} 
                                className="product-image" 
                            />
                            <div className="info-product" style={{maxWidth: "350px"}}>
                                <h2 className="title-product-collection">{product.name}</h2>
                                <p className="price-product-collection">À partir de {product.price}€</p>
                            </div>
                        </div>
                    </Link>
                ))}
           </div>
       </div>
   );
};

export default ProductList;