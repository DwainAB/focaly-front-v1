import React, { useState, useEffect, useRef } from 'react';
import './Carrousel.css';
import imgLucy from "../../Assets/lucy.png";
import imgLenna from "../../Assets/lenna.png";

const Carrousel = () => {
    const images = [
        {
            src: imgLenna,
            text1: '« Fan de réseaux sociaux et de photographie. C\'est un plaisir pour moi de permettre à ma communauté d\'avoir accès à des appareils de qualité, à des prix accessibles pour immortaliser leurs plus beaux souvenirs. »',
            text2: 'Lenna Vivas',
        },
        {
            src: imgLucy,
            text1: '« Passionnée de voyage, Focaly m\'offre la possibilité d\'avoir accès aux matériels les plus qualitatifs sur le marché. Cela me permet de faire vivre à ma communauté mes voyages. Louez votre matériel et capturez vos moments ! »',
            text2: 'Rose Lucy',
        },
    ];

    const [currentImage, setCurrentImage] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNextImage();
        }, 5000); // Durée entre les images
        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        const handleScroll = () => {
            if (carouselRef.current) {
                const rect = carouselRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                
                if (rect.top <= windowHeight * 0.75) {
                    setIsVisible(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNextImage = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentImage((prevImage) =>
                prevImage === images.length - 1 ? 0 : prevImage + 1
            );
            setIsTransitioning(false);
        }, 500); // Durée de la transition
    };

    return (
        <div 
            className={`carousel ${isVisible ? 'visible' : ''}`}
            ref={carouselRef}
        >
            <div className="shadow"></div>
            <img
                src={images[currentImage].src}
                alt={`carousel-${currentImage}`}
                className={`carousel-image ${isTransitioning ? 'fade-out' : 'fade-in'}`}
            />
            <div className="carousel-text">
                <h2>{images[currentImage].text1}</h2>
                <p>{images[currentImage].text2}</p>
            </div>
            <div className="carousel-indicator-wrapper">
                {currentImage + 1}
            </div>
        </div>
    );
};

export default Carrousel;