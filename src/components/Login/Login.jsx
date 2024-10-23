import React, { useState } from "react";
import "./Login.css"
import { apiService } from "../API/Api";

function Login({onBack}){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await apiService.login(email, password);
            console.log(response);
            console.log(response.token);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            window.dispatchEvent(new Event('storage'))
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <>

            <div className="container-title-form">
                <span class="material-symbols-outlined" onClick={onBack}>arrow_back</span>
                <h1 className="title-registerAndSignup">Se connecter</h1>
            </div>


            <form className="form-registerAndSignup" onSubmit={handleSubmit}>
                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">person</span>
                    <input placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input placeholder="Mot de passe" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button type="submit">Se connecter</button>
                <p>Mot de passe oublié ?</p>

            </form>
        </>
    )
}

export default Login