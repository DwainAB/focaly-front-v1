import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './reset.css';
import TopNavbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './Page/Home/Home.jsx'; 
import ConditionsGenerales from './Page/ConditionsGenerales/ConditionsGenerales.jsx';
import MentionsLegales from './Page/MentionsLegales/MentionsLegales.jsx';
import FAQ from './Page/FAQ/FAQ.jsx';
import Contact from './Page/Contact/Contact.jsx';
import Collection from './Page/Collection/Collection.jsx';
import Product from './Page/Product/Product.jsx';
import LoginPage from './Page/LoginPage/LoginPage.jsx';
import DashboardClient from './Page/DashboardClient/DashboardClient.jsx';
import ShoppingCart from './Page/ShoppingCart/ShoppingCart.jsx';

const App = () => {
    useEffect(() => {
        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.text = 'var agSiteId="10927";';
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.src = 'https://www.societe-des-avis-garantis.fr/wp-content/plugins/ag-core/widgets/JsWidget.js';
        script2.type = 'text/javascript';
        document.body.appendChild(script2);

        return () => {
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        };
    }, []);

    return (
        <Router>
            <div>
                <TopNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/collection/:categoryURL" element={<Collection />} />
                    <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                    <Route path="/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/panier" element={<ShoppingCart />} /> 
                    <Route path="/product/:id" element={<Product />} /> 
                    <Route path="/connexion" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardClient />} />
                </Routes>
                <iframe
                    width="100%"
                    height="200"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src="https://www.societe-des-avis-garantis.fr/wp-content/plugins/ag-core/widgets/iframe/2/h/?id=10927"
                >
                </iframe>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
