const BASE_URL = 'https://focaly-service.in/public/api'; 

export const apiService = {

    //Récupère tous les produits
    getProducts: async () => {
        try {
            const response = await fetch(`${BASE_URL}/products`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    //Récupère les produits par catégorie
    getProductsByCategory: async (category) => {
        try {
            const response = await fetch(`${BASE_URL}/products/category/${category}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    //Récupère les produits par id
    getProductById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/product/${id}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    //Récupère les produits depuis la barre de recherche
    getProductsBySearch: async (search) =>{
        try{
            const response = await fetch(`${BASE_URL}/products?search=${search}`);
            return await response.json();
        }catch(error){
            throw error;
        }
    },

    //Récupère les accessoires en fonctions des ids de produit
    getAccessoriesBatch: async(id)=>{
        try{
            const response = await fetch(`${BASE_URL}/accessories/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(id),
            });
            return await response.json();
        }catch(error){
            throw error;
        }
    },

    //Récupère tous les accessoires
    getAccessories: async()=>{
        try{
            const response = await fetch(`${BASE_URL}/accessories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        }catch(error){
            throw error;
        }
    },

    //Ajoute un utilisateur 
    addUser: async (formData) => {
        try {
            const response = await fetch(`${BASE_URL}/add/user`, {
                method: 'POST',
                body: formData,
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    //Modifier un utilisateur
    updateUser: async(id, data) => {
        try {
            const response = await fetch(`${BASE_URL}/update/user/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type" : 'application/json'
                },
                body: JSON.stringify(data),
            });
            
            console.log("Réponse serveur :", response); 
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`); 
            }
    
            return response.json();
        } catch (error) {
            console.error("Erreur lors de la mise à jour des informations :", error);
            throw error;
        }
    },
    

    //Connexion d'un utilisateur
    login: async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    //Envoyer une commande 
    sendOrder: async (data)=>{
        try{
            const response = await fetch(`${BASE_URL}/add/order`, {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        }catch(error){
            throw error;
        }
    },

    //Récupère les commandes d'un client
    getOrderByClient: async (id)=>{
        try {
            const response = await fetch(`${BASE_URL}/order/client/${id}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    //Inscription à la newsletter
    newsletterSubscribe: async (email) => {
        try {
            const formData = new FormData();
            formData.append('email', email);
    
            const response = await fetch(`${BASE_URL}/newsletter/subscribe`, {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Erreur HTTP : ' + response.status); // Lancer une erreur si la réponse HTTP n'est pas OK
            }
    
            const responseData = await response.json();  
            return responseData;  
        } catch (error) {
            throw error;  
        }
    },

    //Récupère la commande égal à la référence donnée
    getOrderByReference: async (ref) => {
        try {
            const response = await fetch(`${BASE_URL}/orders-ref/${encodeURIComponent(ref)}`);
            
            if (!response.ok) {
                // Si la réponse n'est pas ok (statut 404, 500, etc.), renvoyer un message d'erreur
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur HTTP : ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Dans api.js
    createStripeIdentitySession: async (orderRef) => {
        const response = await fetch(`${BASE_URL}/create-verification-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderRef }),
        });
        return response.json();
    },

    // Modifier une commande
    updateOrder: async (id, data) => {
        try {
            const response = await fetch(`${BASE_URL}/update/order/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la commande :", error);
            throw error;
        }
    },
    




};