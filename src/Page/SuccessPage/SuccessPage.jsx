import React, { useEffect, useState } from "react";
import "./SuccessPage.css";
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function SuccessPage() {

    useEffect(()=>{
        localStorage.removeItem('cartItems')
        localStorage.removeItem('orderSummary')
        localStorage.removeItem('comment')
    })


    return (
        <div className="container-success">
            <h1 className="title-success">Merci pour votre commande !</h1>
            <p className="subtitle-success">Un email de confirmation contenant votre numéro de commande vous a été envoyé.</p>
            <Link to={"/"}>
                <button className="button-success">Revenir à l'accueil</button>
            </Link>
        </div>
    );
}

export default SuccessPage;
