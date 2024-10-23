import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { apiService } from "../../components/API/Api";
import "./Dashboard.css"

function DashboardClient() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [editedUserInfo, setEditedUserInfo] = useState(null); 

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
                                <div className="item-personnal-info">
                                    <span className="material-symbols-outlined">person</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={editedUserInfo.firstname}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p>{userInfo.firstname}</p>
                                    )}
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={editedUserInfo.lastname}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p>{userInfo.lastname}</p>
                                    )}
                                </div>

                                <div className="item-personnal-info">
                                    <span className="material-symbols-outlined">location_on</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={editedUserInfo.address}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p>{userInfo.address}</p>
                                    )}
                                </div>

                                <div className="item-personnal-info">
                                    <span className="material-symbols-outlined">call</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
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
                                            type="email"
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
                                <button onClick={handleSave}>Sauvegarder</button>
                            )}
                        </div>

                        <div className="list-order">
                            <div className="container-title-order">
                                <h2>Mes commandes</h2>
                            </div>
                            <p className="text-order-empty">Pas encore de commande</p>
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
