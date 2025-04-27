import supabase from "../lib/Supabase";

class ProductsService {

    static async getProduct(limit = null) {
        try {

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(limit);

            if (error) {
                throw new Error(error.message);
            }

            if (!data || data.length === 0) {
                return [];
            }

            const productsWithImages = await Promise.all(data.map(async (product) => {
                try {
                    const { data: imageData, error: imageError } = await supabase
                        .from('path_images')
                        .select('path_url')
                        .eq('product_id', product.id)
                        .limit(1);
                        
                    return {
                        ...product,
                        mainImage: imageData && imageData.length > 0 ? imageData[0].path_url : null
                    };
                } catch (err) {
                    console.warn(`Impossible de récupérer l'image pour le produit ${product.id}:`, err);
                    return { ...product, mainImage: null };
                }
            }));

            return productsWithImages;
        } catch (error) {
            console.error("Erreur lors de la récupération des produits:", error);
            throw error;
        }
    }

    static async getCategory(){
        try{
            const { data, error } = await supabase
                .from('category')
                .select('*');

            if(error){
                throw error;
            }

            return data || [];
        }catch(error){
            console.error("Erreur lors de la récupération des categories:", error);
            throw error;
        }
    }

    static async getProductByCategory(id){
        try{
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('category', id);

            if(error){
                throw error;
            }

            if (!data || data.length === 0) {
                return [];
            }

            const productsWithImages = await Promise.all(data.map(async (product) => {
                try {
                    const { data: imageData, error: imageError } = await supabase
                        .from('path_images')
                        .select('path_url')
                        .eq('product_id', product.id)
                        .limit(1);
                        
                    return {
                        ...product,
                        mainImage: imageData && imageData.length > 0 ? imageData[0].path_url : null
                    };
                } catch (err) {
                    console.warn(`Impossible de récupérer l'image pour le produit ${product.id}:`, err);
                    return { ...product, mainImage: null };
                }
            }));

            return productsWithImages;
        }catch(error){
            console.error('Erreur lors de la récupération des produits par catégorie:', error);
            throw error; 
        }
    }

    static async getProductById(id) {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single(); 
    
            if (error) {
                throw error;
            }
    
            if (!data) {
                return null; 
            }
    
            const { data: imageData, error: imageError } = await supabase
                .from('path_images')
                .select('path_url')
                .eq('product_id', id);
                
            if (imageError) {
                console.warn(`Impossible de récupérer les images pour le produit ${id}:`, imageError);
            }
            
            return {
                ...data,
                images: imageData || []
            };
    
        } catch (error) {
            console.error("Erreur lors de la récupération du produit:", error);
            throw error;
        }
    }

    static async getDateUnavailable(productId) {
        try {
            const response = await fetch("https://ysypvciwtuyxflkkxnzz.supabase.co/functions/v1/order-date-unavailable", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: productId })
            });
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
    
            const data = await response.json();
            return data;
    
        } catch (error) {
            console.error("Erreur lors de la récupération des dates indisponibles:", error);
            throw error;
        }
    }

    static async getQuantityAvailable(productId, startDate, endDate){
        try{
            const response = await fetch("https://ysypvciwtuyxflkkxnzz.supabase.co/functions/v1/product-availability",{
                method: "POST",
                header: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    product_id: productId,
                    start_date: startDate,
                    end_date: endDate
                })
            })

            if(!response){
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json()
            return data

        }catch(error){
            console.error("Erreur lors de la récupétation des quantitées", error)
        }
    }
}

export default ProductsService;