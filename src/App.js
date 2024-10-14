import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './reset.css';
import TopNavbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './Page/Home/Home.jsx'; 
import SearchPage from './components/SearchPage/SearchPage.jsx';
import ConditionsGenerales from './Page/ConditionsGenerales/ConditionsGenerales.jsx';
import MentionsLegales from './Page/MentionsLegales/MentionsLegales.jsx';
import FAQ from './Page/FAQ/FAQ.jsx';
import Contact from './Page/Contact/Contact.jsx';
import Cart from './components/Cart/Cart.jsx';
import Collection from './Page/Collection/Collection.jsx';
import Product from './Page/Product/Product.jsx';
import Login from './Page/Login/Login.jsx';
import DashboardClient from './Page/DashboardClient/DashboardClient.jsx';

const App = () => {
    return (
        <Router>
            <div>
                <TopNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/collection/:categoryURL" element={<Collection/>}/>
                    <Route path="/search" element={<SearchPage />} /> 
                    <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                    <Route path="/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/panier" element={<Cart />} /> 
                    <Route path="/product/:id" element={<Product />} /> 
                    <Route path='/connexion' element={<Login/>}/>
                    <Route path='/dashboard' element={<DashboardClient/>}/>
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;