import React, { useState } from "react";
import "./Signup.css"
import { apiService } from "../API/Api";

function Signup({ onBack }) {
    const [errors, setErrors] = useState({}); // État pour les erreurs
    const [password, setPassword] = useState(""); // État pour le mot de passe
    const [confirmPassword, setConfirmPassword] = useState(""); // État pour la confirmation du mot de passe

    const validateForm = (event) => {
        const newErrors = {};
        // Validation des champs requis
        if (!event.target.firstname.value) {
            newErrors.firstname = "Le champ prénom est obligatoire.";
        }
        if (!event.target.lastname.value) {
            newErrors.lastname = "Le champ nom est obligatoire.";
        }
        if (!event.target.email.value) {
            newErrors.email = "Le champ email est obligatoire.";
        }
        if (!event.target.address.value) {
            newErrors.address = "Le champ adresse est obligatoire.";
        }
        if (!event.target.zip_code.value) {
            newErrors.zip_code = "Le champ code postal est obligatoire.";
        }
        if (!event.target.city.value) {
            newErrors.city = "Le champ ville est obligatoire.";
        }
        if (!event.target.phone.value) {
            newErrors.phone = "Le champ téléphone est obligatoire.";
        }
        // Validation des mots de passe
        if (!password || !confirmPassword) {
            newErrors.password = "Le mot de passe est requis.";
        } else if (password !== confirmPassword) {
            newErrors.password = "Les mots de passe ne correspondent pas.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)) {
            newErrors.password = "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (ex: @$!%*?&).";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retourne vrai si aucune erreur
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm(event)) return; // Ne soumet pas si le formulaire n'est pas valide
        const formData = new FormData(event.target);
        apiService.addUser(formData)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return(
        <>

            <div className="container-title-form">
                <span class="material-symbols-outlined" onClick={onBack}>arrow_back</span>
                <h1 className="title-registerAndSignup">S'inscrire</h1>
            </div>

            <form className="form-registerAndSignup" onSubmit={handleSubmit}>

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">person</span>
                    <input name="firstname" placeholder="Prénom" type="text" required />
                </div>
                {errors.firstname && <div className="error-message" style={{ color: 'red' }}>{errors.firstname}</div>} 

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">person</span>
                    <input name="lastname" placeholder="Nom" type="text" required />
                </div>
                {errors.lastname && <div className="error-message" style={{ color: 'red' }}>{errors.lastname}</div>} 

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">alternate_email</span>
                    <input name="email" placeholder="Email" type="email" required />
                </div>
                {errors.email && <div className="error-message" style={{ color: 'red' }}>{errors.email}</div>} 

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input 
                        name="password" 
                        placeholder="Mot de passe" 
                        type="password" 
                        required 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                {errors.password && <div className="error-message" style={{ color: 'red' }}>{errors.password}</div>} 


                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input 
                        placeholder="Confirmation mot de passe" 
                        type="password" 
                        required 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>
                {errors.password && <div className="error-message" style={{ color: 'red' }}>{errors.password}</div>} 

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">flag</span>
                    <input name="address" placeholder="Adresse" type="text" required />
                </div>
                {errors.address && <div className="error-message" style={{ color: 'red' }}>{errors.address}</div>} 

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">location_on</span>
                    <input name="zip_code" placeholder="Code Postal" type="text" required />
                </div>
                {errors.zip_code && <div className="error-message" style={{ color: 'red' }}>{errors.zip_code}</div>} 

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">location_city</span>
                    <input name="city" placeholder="Ville" type="text" required />
                </div>
                {errors.city && <div className="error-message" style={{ color: 'red' }}>{errors.city}</div>} 

                <div className="container-registerAndSignup-input">
                    <span class="material-symbols-outlined">lock</span>
                    <input name="phone" placeholder="+33" type="text" required />
                </div>
                {errors.phone && <div className="error-message" style={{ color: 'red' }}>{errors.phone}</div>} 

                <button type="submit">S'inscrire</button>

            </form>

        </>
    )
}

export default Signup
