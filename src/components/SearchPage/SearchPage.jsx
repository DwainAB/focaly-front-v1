import React, { useState, useEffect } from 'react';
import './SearchPage.css';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Recherche pour :', query);
    };

    return (
        <div className={`search-page ${isVisible ? 'fade-in' : ''}`}>
            <h1>Rechercher un produit</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Entrez votre recherche..."
                    className="search-input"
                />
                <button type="submit" className="search-button">Rechercher</button>
            </form>
        </div>
    );
};

export default SearchPage;