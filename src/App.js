import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer.jsx';
import Home from './Page/Home/Home.jsx'; 
import SearchPage from './Page/SearchPage/SearchPage.jsx';
import ConditionsGenerales from './Page/ConditionsGenerales/ConditionsGenerales.jsx';
import MentionsLegales from './Page/MentionsLegales/MentionsLegales.jsx';
import FAQ from './Page/FAQ/FAQ.jsx';
import Contact from './Page/Contact/Contact.jsx';
import Cameras from './Page/Cameras/Cameras.jsx'; // Importer le composant Cameras
import AppareilsPhotos from './Page/Appareils Photos/AppareilsPhotos.jsx'; // Importer le composant Cameras


const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                    <Route path="/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cameras" element={<Cameras />} /> {/* Ajouter la route pour Cameras */}
                    <Route path="/AppareilsPhotos" element={<AppareilsPhotos />} /> 
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;