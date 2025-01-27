import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { apiService } from "../../components/API/Api";
import { Link } from "react-router-dom";
import { 
    Edit, 
    LogOut, 
    User, 
    MapPin, 
    Phone, 
    Mail, 
    Check, 
    Truck, 
    Package, 
    Clock,
    X,
    CheckCircle,
    Calendar
} from "lucide-react";
import "./Dashboard.css"

function DashboardClient() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [editedUserInfo, setEditedUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4; // 4 cartes par page

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Modifiez la fonction getCurrentOrders comme ceci :
    const getCurrentOrders = () => {
        // D'abord, trier les commandes par date de création (du plus récent au plus ancien)
        const sortedOrders = [...orders].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Ordre décroissant (plus récent au plus ancien)
        });
        
        // Ensuite, récupérer la page courante
        const startIndex = (currentPage - 1) * ordersPerPage;
        return sortedOrders.slice(startIndex, startIndex + ordersPerPage);
    };

    // Générer les numéros de page à afficher
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        
        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

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

    useEffect(() => {
        const getOrderClient = async (id) => {
            try {
                const response = await apiService.getOrderByClient(id);
                if(response) {
                    setOrders(response);
                }
            } catch(error) {
                console.error("Erreur lors de la récupération des commandes:", error);
            }
        };

        if(userInfo) {
            getOrderClient(userInfo.id);
        }
    }, [userInfo]);

    const clearLocalStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
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

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const getStepStatus = (stepOrder, currentStatus) => {
        const statusOrder = {
            'pending': 0,
            'waiting_start_date': 1,
            'processing': 2,
            'ready': 3,
            'shipped': 4
        };
        const currentStep = statusOrder[currentStatus];
        
        if (stepOrder < currentStep) return 'completed';
        if (stepOrder === currentStep) return 'active';
        return '';
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            'pending': {
                label: "À vérifier",
                icon: <Clock className="icon-status" />,
                className: "status-pending"
            },
            'waiting_start_date': {
                label: "Location à venir",
                icon: <Calendar className="icon-status" />,
                className: "status-waiting"
            },
            'processing': {
                label: "En préparation",
                icon: <Package className="icon-status" />,
                className: "status-preparing"
            },
            'ready': {
                label: "Prêt",
                icon: <CheckCircle className="icon-status" />,
                className: "status-ready"
            },
            'shipped': {
                label: "Expédiée",
                icon: <Truck className="icon-status" />,
                className: "status-shipped"
            }
        };
        return statusMap[status] || statusMap.pending;
    };

    

    return (
        <>
            {userInfo !== null ? (
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">
                            Bonjour {userInfo.firstname} {userInfo.lastname}
                        </h1>
                        <button className="logout-button" onClick={clearLocalStorage}>
                            <LogOut />
                        </button>
                    </div>

                    <div className="dashboard-content">
                        <div className="user-info-card">
                            <div className="card-header">
                                <h2 className="card-title">Mes informations personnelles</h2>
                                <button className="edit-button" onClick={toggleEdit}>
                                    <Edit />
                                </button>
                            </div>

                            <div className="info-list">
                                <div className="info-item">
                                    <User className="info-icon" />
                                    <div className={`info-content ${isEditing ? 'editing' : ''}`}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    placeholder="Prénom"
                                                    value={editedUserInfo.firstname}
                                                    onChange={handleInputChange}
                                                />
                                                <input
                                                    type="text"
                                                    name="lastname"
                                                    placeholder="Nom"
                                                    value={editedUserInfo.lastname}
                                                    onChange={handleInputChange}
                                                />
                                            </>
                                        ) : (
                                            <p>{userInfo.firstname} {userInfo.lastname}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="info-item">
                                    <MapPin className="info-icon" />
                                    <div className={`info-content ${isEditing ? 'editing' : ''}`}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    placeholder="Adresse"
                                                    value={editedUserInfo.address}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="address-inputs">
                                                    <input
                                                        type="text"
                                                        name="zip_code"
                                                        placeholder="Code postal"
                                                        value={editedUserInfo.zip_code}
                                                        onChange={handleInputChange}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        placeholder="Ville"
                                                        value={editedUserInfo.city}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p>{userInfo.address}</p>
                                                <p>{userInfo.zip_code} {userInfo.city}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="info-item">
                                    <Phone className="info-icon" />
                                    <div className="info-content">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="phone"
                                                placeholder="Téléphone"
                                                value={editedUserInfo.phone}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{userInfo.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="info-item">
                                    <Mail className="info-icon" />
                                    <div className="info-content">
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={editedUserInfo.email}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{userInfo.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <button className="save-button" onClick={handleSave}>
                                    Enregistrer
                                </button>
                            )}
                        </div>

                        <div className="orders-card">
            <h2 className="card-title">Mes commandes</h2>
            {orders.length === 0 ? (
                <p className="empty-message">Vous n'avez pas encore de commande</p>
            ) : (
                <>
                    <div className="orders-grid">
                        {getCurrentOrders().map(order => {
                            const status = getStatusInfo(order.status);
                            return (
                                <div key={order.id} className="order-item" onClick={() => handleOrderClick(order)}>
                                    <div className="order-header">
                                        <div className="order-ref">
                                            <p className="ref-number">#{order.refOrder}</p>
                                            <p className="order-price">{order.totalPrice} €</p>
                                        </div>
                                        <div className={`order-status ${status.className}`}>
                                            {status.icon}
                                            <span>{status.label}</span>
                                        </div>
                                    </div>
                                    <div className="order-dates">
                                        <p>Du {new Date(order.startDate).toLocaleDateString('fr-FR')}</p>
                                        <p>Au {new Date(order.endDate).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="pagination-button"
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentPage === 1}
                            >
                                ←
                            </button>
                            
                            {getPageNumbers().map(number => (
                                <button
                                    key={number}
                                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(number)}
                                >
                                    {number}
                                </button>
                            ))}
                            
                            <button 
                                className="pagination-button"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage === totalPages}
                            >
                                →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
                    </div>

                    {selectedOrder && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <button className="modal-close" onClick={closeModal}>
                                    <X />
                                </button>
                                
                                <h3 className="card-title">Commande {selectedOrder.refOrder}</h3>
                                
                                <div className="stepper">
                                    <div className={`step ${getStepStatus(0, selectedOrder.status)}`}>
                                        <div className="step-icon">
                                            {getStepStatus(0, selectedOrder.status) === 'completed' ? 
                                                <CheckCircle /> : 
                                                <Clock />
                                            }
                                        </div>
                                        <span className="step-label">À vérifier</span>
                                    </div>
                                    
                                    <div className={`step ${getStepStatus(1, selectedOrder.status)}`}>
                                        <div className="step-icon">
                                            {getStepStatus(1, selectedOrder.status) === 'completed' ? 
                                                <CheckCircle /> : 
                                                <Calendar />
                                            }
                                        </div>
                                        <span className="step-label">Location à venir</span>
                                    </div>
                                    
                                    <div className={`step ${getStepStatus(2, selectedOrder.status)}`}>
                                        <div className="step-icon">
                                            {getStepStatus(2, selectedOrder.status) === 'completed' ? 
                                                <CheckCircle /> : 
                                                <Package />
                                            }
                                        </div>
                                        <span className="step-label">En préparation</span>
                                    </div>
                                    
                                    <div className={`step ${getStepStatus(3, selectedOrder.status)}`}>
                                        <div className="step-icon">
                                            {getStepStatus(3, selectedOrder.status) === 'completed' ? 
                                                <CheckCircle /> : 
                                                <CheckCircle />
                                            }
                                        </div>
                                        <span className="step-label">Prêt</span>
                                    </div>
                                    
                                    <div className={`step ${getStepStatus(4, selectedOrder.status)}`}>
                                        <div className="step-icon">
                                            <Truck />
                                        </div>
                                        <span className="step-label">Expédiée</span>
                                    </div>
                                </div>

                                <div className="order-details">
                                    <p>Du {new Date(selectedOrder.startDate).toLocaleDateString('fr-FR')}</p>
                                    <p>Au {new Date(selectedOrder.endDate).toLocaleDateString('fr-FR')}</p>
                                    <p>Total : {selectedOrder.totalPrice} €</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Loader />
            )}
        </>
    );
}

export default DashboardClient;