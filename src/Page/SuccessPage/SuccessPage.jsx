import React from "react";
import "./SuccessPage.css"
import {Link} from "react-router-dom"

function SuccessPage(){
    return(
        <div className="container-success">
            <h1 className="title-success">Merci pour votre commande !</h1>
            <p className="subtitle-success">Un email de confirmation contenant votre numéro de commande vous à été envoyé.</p>
            <Link to={"/"}><button className="button-success">Revenir à l'accueil</button></Link>
        </div>
    )
}

export default SuccessPage