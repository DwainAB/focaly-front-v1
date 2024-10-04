import React from "react";
import "./Signup.css"

function Signup({ onBack }){
    return(
        <>

            <div className="container-title-form">
                <span class="material-symbols-outlined" onClick={onBack}>arrow_back</span>
                <h1 className="title-registerAndSignup">S'inscrire</h1>
            </div>

            <form className="form-registerAndSignup">

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">person</span>
                    <input placeholder="Prénom" type="text" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">person</span>
                    <input placeholder="Nom" type="text" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">alternate_email</span>
                    <input placeholder="Email" type="email" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input placeholder="Mot de passe" type="password" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input placeholder="Confirmation mot de passe" type="password" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">flag</span>
                    <input placeholder="Adresse" type="text" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">location_on</span>
                    <input placeholder="Code Postal" type="text" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">location_city</span>
                    <input placeholder="Ville" type="text" required />
                </div>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input placeholder="+33" type="text" required />
                </div>

                <button type="submit">S'inscrire</button>

            </form>

        </>
    )
}

export default Signup