import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../../Assets/banner.png';
import Produits from '../../components/Products/Products'; 
import Carrousel from '../../components/Carrousel/Carrousel';
import About from '../../components/About/About';
import './Home.css'; 



const Home = () => {
    return (
        <>
        <div className="container-header">
            <div className="shadow"></div>
            <img className="imgBanner" src={Banner} alt="" />
            <h1 className="title-product-header">Louez un drone DJI pour 3,40€/jour</h1>
            <Link className="button-product-header" to="/">Je découvre</Link>
        </div>
            <Produits /> 
            <Carrousel /> 
            <About /> 
        </>
    );
};

export default Home;