import React from "react";
import "./Login.css"

function Login({onBack}){
    return(
        <>

            <div className=" container-title-form">
                <span class="material-symbols-outlined" onClick={onBack}>arrow_back</span>
                <h1 className="title-registerAndSignup">Se connecter</h1>
            </div>


            <form className="form-registerAndSignup">
                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">person</span>
                    <input placeholder="Email" type="email" required />
                </div>
                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input placeholder="Mot de passe" type="password" required />
                </div>

                <button type="submit">Se connecter</button>
                <p>Mot de passe oublié ?</p>

            </form>
        </>
    )
}

export default Login