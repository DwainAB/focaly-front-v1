import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer.jsx';
import Home from './Page/Home/Home.jsx'; 
import SearchPage from './components/SearchPage/SearchPage.jsx';
import ConditionsGenerales from './Page/ConditionsGenerales/ConditionsGenerales.jsx';
import MentionsLegales from './Page/MentionsLegales/MentionsLegales.jsx';
import FAQ from './Page/FAQ/FAQ.jsx';
import Contact from './Page/Contact/Contact.jsx';
import Cameras from './Page/Cameras/Cameras.jsx';
import AppareilsPhotos from './Page/Appareils Photos/AppareilsPhotos.jsx';
import Drones from './Page/drones/drones.jsx';
import Accessoires from './Page/Accessoires/Accessoires.jsx';
import Packes from './Page/Packs/Packs.jsx';
import Professionnels from './Page/Professionnels/Professionnels.jsx';
import Cart from './components/Cart/Cart.jsx';



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
                    <Route path="/cameras" element={<Cameras />} /> 
                    <Route path="/AppareilsPhotos" element={<AppareilsPhotos />} /> 
                    <Route path="/Drones" element={<Drones />} /> 
                    <Route path="/Accessoires" element={<Accessoires />} /> 
                    <Route path="/Packes" element={<Packes />} /> 
                    <Route path="/Professionnels" element={<Professionnels />} /> 
                    <Route path="/Cart" element={<Cart />} /> 
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;