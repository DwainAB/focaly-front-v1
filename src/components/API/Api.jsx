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

    createStripeIdentitySession: async (orderRef) => {
        try {
            const response = await fetch(`${BASE_URL}/create-verification-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderRef })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erreur lors de la création de la session");
            }
            
            return response.json();
        } catch (error) {
            console.error("Erreur lors de la création de la session:", error);
            throw error;
        }
    },

    // Dans Api.jsx, ajoutez cette méthode à votre apiService

    checkVerificationStatus: async (orderRef) => {
        const maxAttempts = 30; // Nombre maximum de tentatives
        const delayBetweenAttempts = 2000; // 2 secondes entre chaque tentative
    
        const checkStatus = async () => {
            try {
                console.log(`Vérification du statut pour la commande: ${orderRef}`);  // Log au début de chaque vérification
                const response = await fetch(`${BASE_URL}/webhook-response/${orderRef}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log('Réponse de la vérification:', result);  // Log de la réponse
                return result;
            } catch (error) {
                console.error('Erreur lors de la vérification du statut:', error);  // Log en cas d'erreur
                throw error;
            }
        };
    
        let attempts = 0;
        while (attempts < maxAttempts) {
            console.log(`Tentative #${attempts + 1}`);  // Log pour chaque tentative
    
            const status = await checkStatus();
            
            // Si on a une réponse définitive, on la retourne
            if (status.status === 'verified' || status.status === 'redacted' || status.status === "requires_input" || status.status ==="canceled") {
                console.log(`Statut final de la vérification: ${status.status}`);  // Log lorsque le statut est final
                return status;
            }
    
            // Sinon, on attend avant de réessayer
            console.log('Statut en cours, réessayer...');  // Log si le statut est encore en cours
            await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
            attempts++;
        }
    
        // Si on arrive ici, c'est qu'on a dépassé le nombre maximum de tentatives
        console.error("Délai d'attente dépassé pour la vérification");  // Log en cas de dépassement du délai
        throw new Error("Délai d'attente dépassé pour la vérification");
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
    
    getGroupsByCategory: async (category) => {
        try {
            const response = await fetch(`${BASE_URL}/group/category/${category}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    getPromoCodeByName: async (code) => {
        try {
            const response = await fetch(`${BASE_URL}/promo-codes/code/${code}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    }



};