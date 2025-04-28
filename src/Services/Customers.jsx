import React from "react";

export default class Customers{

    static async createCustomer(user){
        try{
            const response = await fetch('https://ysypvciwtuyxflkkxnzz.supabase.co/functions/v1/customer-create',{
                method:"POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            if(!response){
                throw new Error(`Erreur HTTP: ${response.status}`);                
            }

            const data = await response.json()
            return data

        }catch (error){
            console.error("Erreur de lors de la cration de l'utilisateur", error);
            throw error
        }
    }

    static async customerLogin(user){
        try{
            const response = await fetch('https://ysypvciwtuyxflkkxnzz.supabase.co/functions/v1/customer-login',{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            if(!response){
                throw new Error(`Erreur HTTP: ${response.status}`);                
            }

            const data = await response.json()
            return data

        }catch(error){
            console.error("Erreur lors de la connexion", error);
            throw error      
        }
    }


}