import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { apiService } from "../../components/API/Api";
import { Link } from "react-router-dom";
import "./Dashboard.css"

function DashboardClient() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [editedUserInfo, setEditedUserInfo] = useState(null); 
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!user || !token) {
            navigate('/');
        } else {
            const parsedUser = JSON.parse(user);
            setUserInfo(parsedUser);
            setEditedUserInfo(parsedUser); 
        }
    }, [navigate]);

    useEffect(()=>{
        const getOrderClient= async (id)=>{
            try{

                const response = await apiService.getOrderByClient(id);
                if(response){
                setOrders(response)
                }

            }catch(error){
                console.error("Erreur lors de la récupératin des commandes:", error);
            }
        }

        if(userInfo){
            console.log(userInfo);
            getOrderClient(userInfo.id)
        }

        if(orders){
            console.log(orders);
        }

    },[userInfo])

    const clearLocalStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserInfo({
            ...editedUserInfo,
            [name]: value,
        });
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return; 
        }
    
        try {
            const userId = userInfo.id; 
            await apiService.updateUser(userId, editedUserInfo); 
            localStorage.setItem('user', JSON.stringify(editedUserInfo)); 
            setUserInfo(editedUserInfo); 
            setIsEditing(false); 
        } catch (error) {
            console.error("Erreur lors de la mise à jour des informations :", error);
        }
    };
    
    const validateForm = () => {
        const { firstname, lastname, address, zip_code, city, phone, email } = editedUserInfo;
        
        if (!firstname || !lastname || !address || !zip_code || !city || !phone || !email) {
            alert("Tous les champs doivent être remplis");
            return false;
        }
    
        if (!/^\d+$/.test(phone) || phone.length !== 10) {
            alert("Le numéro de téléphone n'est pas valide");
            return false;
        }
    
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("L'adresse email n'est pas valide");
            return false;
        }
    
        return true;
    };
    

    return (
        <>
            {userInfo !== null ? (
                <div className="container-info-client">
                    <div className="container-title">
                        {userInfo && <h1 className="title-dashboard">Bonjour {userInfo.firstname} {userInfo.lastname}</h1>}
                        <span className="material-symbols-outlined" onClick={clearLocalStorage}>power_settings_new</span>
                    </div>

                    <div className="section-info-client">
                        <div className="personnal-information">
                            <div className="container-title-personnal-info">
                                <h2>Mes informations personnelles</h2>
                                <span className="material-symbols-outlined" onClick={toggleEdit}>edit_square</span>
                            </div>

                            <div className="list-personnal-info">
                                <div className={`item-personnal-info`}>
                                    <span className="material-symbols-outlined">person</span>
                                    <div className={`${isEditing ? 'editing-mode' : ''}`}>
                                        {isEditing ? (
                                            <input
                                                className="input-personnal-info"
                                                type="text"
                                                placeholder="Prénom"
                                                required
                                                name="firstname"
                                                value={editedUserInfo.firstname}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{userInfo.firstname} {userInfo.lastname}</p>
                                        )}
                                        {isEditing ? (
                                            <input
                                                className="input-personnal-info"
                                                type="text"
                                                placeholder="Nom"
                                                required
                                                name="lastname"
                                                value={editedUserInfo.lastname}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>

                                <div className="item-personnal-info">
                                    <span className="material-symbols-outlined">location_on</span>
                                    <div className={`${isEditing ? 'editing-mode' : ''}`}>
                                        {isEditing ? (
                                            <input
                                                className="input-personnal-info"
                                                type="text"
                                                placeholder="adresse"
                                                required
                                                name="address"
                                                value={editedUserInfo.address}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <div>{userInfo.address}</div> 
                                        )}
                                        {isEditing ? (
                                            <input
                                                className="input-personnal-info"
                                                placeholder="Code postal"
                                                type="text"
                                                name="zip_code"
                                                value={editedUserInfo.zip_code}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{userInfo.zip_code} {userInfo.city}</p>
                                        )}
                                        {isEditing ? (
                                            <input
                                                className="input-personnal-info"
                                                type="text"
                                                placeholder="ville"
                                                required
                                                name="city"
                                                value={editedUserInfo.city}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>

                                <div className="item-personnal-info">
                                    <span className="material-symbols-outlined">call</span>
                                    {isEditing ? (
                                        <input
                                            className="input-personnal-info"
                                            type="text"
                                            placeholder="Numéro"
                                            required
                                            name="phone"
                                            value={editedUserInfo.phone}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p>{userInfo.phone}</p>
                                    )}
                                </div>

                                <div className="item-personnal-info">
                                    <span className="material-symbols-outlined">alternate_email</span>
                                    {isEditing ? (
                                        <input
                                            className="input-personnal-info"
                                            type="email"
                                            placeholder="Email"
                                            required
                                            name="email"
                                            value={editedUserInfo.email}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p>{userInfo.email}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <button className="button-update" onClick={handleSave}>Sauvegarder</button>
                            )}
                        </div>

                        <div className="list-order">
                            <div className="container-title-order">
                                <h2>Mes commandes</h2>
                            </div>
                            {orders.length === 0 ? (
                                <p className="text-order-empty">Pas encore de commande</p>
                            ) : (
                                <div className="container-list-order">
                                    {orders && orders.length > 0 ? (
                                        orders.map(order => (
                                            <Link key={order.id} className="order-item">

                                                <div className="container-left-order-item">
                                                    <p>{order.refOrder}</p>
                                                    <p>{order.totalPrice} €</p>
                                                </div>
                                                <div className="container-right-order-item">
                                                    <p>{new Date(order.startDate).toLocaleDateString('fr-FR')}</p>
                                                    <p>{new Date(order.endDate).toLocaleDateString('fr-FR')}</p>
                                                </div>

                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-order-empty">Pas encore de commande</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </>
    );
}

export default DashboardClient;
