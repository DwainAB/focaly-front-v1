import React from 'react';
import './Home.css'; 
import { Link } from 'react-router-dom';
import bannerImage from '../../Assets/banner.png';
import Produits from '../../components/Products/Products'; 
import Carrousel from '../../components/Carrousel/Carrousel';
import About from '../../components/About/About';



const Home = () => {
    return (
        <>
        <div className="container-header position-relative">
            <div className="shadow position-absolute"></div>
            <img className="imgBanner img-fluid" src={bannerImage} alt="Bannière" />
            <h1 className="title-header position-absolute">Louez un drone DJI pour 3,40€/jour</h1>
            <Link className="button-header position-absolute" to="/">Je découvre</Link>
        </div>
            <Produits /> 
            <Carrousel /> 
            <About /> 
        </>
    );
};

export default Home;