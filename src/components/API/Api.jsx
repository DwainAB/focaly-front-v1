const BASE_URL = 'http://localhost:8000/api'; 

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
};