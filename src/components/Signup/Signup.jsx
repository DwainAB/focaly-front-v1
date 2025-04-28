import React, { useState } from "react";
import "./Signup.css";
import Customers from "../../Services/Customers";

function Signup({ onBack }) {
    const [errors, setErrors] = useState({});
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorApi, setErrorApi] = useState('');
    const [cities, setCities] = useState([]); 
    const [selectedCity, setSelectedCity] = useState(""); 
    const [zipCode, setZipCode] = useState(""); 
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = (event) => {
        const newErrors = {};
        if (!event.target.firstname.value) newErrors.firstname = "Le champ prénom est obligatoire.";
        if (!event.target.lastname.value) newErrors.lastname = "Le champ nom est obligatoire.";
        if (!event.target.email.value) newErrors.email = "Le champ email est obligatoire.";
        if (!event.target.address.value) newErrors.address = "Le champ adresse est obligatoire.";
        if (!zipCode) newErrors.zip_code = "Le champ code postal est obligatoire.";
        if (!selectedCity) newErrors.city = "Le champ ville est obligatoire.";
        if (!event.target.phone.value) newErrors.phone = "Le champ téléphone est obligatoire.";

        if (!password || !confirmPassword) {
            newErrors.password = "Le mot de passe est requis.";
        } else if (password !== confirmPassword) {
            newErrors.password = "Les mots de passe ne correspondent pas.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)) {
            newErrors.password = "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (ex: @$!%*?&).";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchCitiesByZipCode = async (zip) => {
        try {
            const response = await fetch(`https://api.zippopotam.us/fr/${zip}`);
            if (!response.ok) throw new Error("Aucune donnée trouvée pour ce code postal.");
            const data = await response.json();
            if (data.places && data.places.length > 0) {
                const cityNames = data.places.map(place => place["place name"]);
                setCities(cityNames); 
                setSelectedCity(cityNames[0]); 
            } else {
                setCities([]);
                setSelectedCity("");
            }
        } catch (error) {
            console.error(error.message);
            setCities([]);
            setSelectedCity("");
        }
    };

    const handleZipCodeChange = (event) => {
        const zip = event.target.value;
        setZipCode(zip);
        if (zip.length === 5) {
            fetchCitiesByZipCode(zip);
        } else {
            setCities([]);
            setSelectedCity(""); 
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm(event)) return;
        
        const formValues = {
            first_name: event.target.firstname.value,
            last_name: event.target.lastname.value,
            email: event.target.email.value,
            password: password,
            phone: event.target.phone.value,
            number: event.target.address.value.split(' ')[0] || "", 
            street: event.target.address.value.split(' ').slice(1).join(' ') || event.target.address.value,
            postal_code: zipCode,
            city: selectedCity,
            country: "France", 
            type: "customers" 
        };
        
        setErrorApi('');
        setSuccessMessage('');
        
        Customers.createCustomer(formValues)
            .then(response => {
                if (response.error) {
                    setErrorApi(response.error);
                } else {
                    setSuccessMessage("Inscription réussie !");
                    event.target.reset();
                    setPassword("");
                    setConfirmPassword("");
                    setZipCode("");
                    setSelectedCity("");
                    setCities([]);
                }
            })
            .catch(error => {
                console.error("Erreur lors de la création du compte :", error);
                setErrorApi("Une erreur est survenue lors de la création de votre compte.");
            });
    };

    return (
        <>
            <div className="container-title-form">
                <span className="material-symbols-outlined" onClick={onBack}>arrow_back</span>
                <h1 className="title-registerAndSignup">S'inscrire</h1>
            </div>

            {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}

            <form className="form-registerAndSignup" onSubmit={handleSubmit}>
                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">person</span>
                    <input name="firstname" placeholder="Prénom" type="text" required />
                </div>
                {errors.firstname && <div className="error-message" style={{ color: 'red' }}>{errors.firstname}</div>}

                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">person</span>
                    <input name="lastname" placeholder="Nom" type="text" required />
                </div>
                {errors.lastname && <div className="error-message" style={{ color: 'red' }}>{errors.lastname}</div>}

                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">alternate_email</span>
                    <input name="email" placeholder="Email" type="email" required />
                </div>
                {errors.email && <div className="error-message" style={{ color: 'red' }}>{errors.email}</div>}

                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">lock</span>
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
                    <span className="material-symbols-outlined">lock</span>
                    <input 
                        placeholder="Confirmation mot de passe" 
                        type="password" 
                        required 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>

                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">location_on</span>
                    <input 
                        name="zip_code" 
                        placeholder="Code Postal" 
                        type="text" 
                        required 
                        value={zipCode}
                        onChange={handleZipCodeChange} 
                    />
                </div>
                {errors.zip_code && <div className="error-message" style={{ color: 'red' }}>{errors.zip_code}</div>}

                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">location_city</span>
                    <select 
                        name="city" 
                        required 
                        value={selectedCity} 
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">Sélectionner une ville</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                {errors.city && <div className="error-message" style={{ color: 'red' }}>{errors.city}</div>}

                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">flag</span>
                    <input name="address" placeholder="Adresse" type="text" required />
                </div>
                {errors.address && <div className="error-message" style={{ color: 'red' }}>{errors.address}</div>}

                <div className="container-registerAndSignup-input">
                    <span className="material-symbols-outlined">phone</span>
                    <input name="phone" placeholder="+33" type="text" required />
                </div>
                {errors.phone && <div className="error-message" style={{ color: 'red' }}>{errors.phone}</div>}
                {errorApi && <p style={{ color: 'red' }}>{errorApi}</p>}

                <button type="submit">S'inscrire</button>
            </form>
        </>
    );
}

export default Signup;