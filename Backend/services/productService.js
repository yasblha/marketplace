import ProductSQL from '../models/postgres_models/ProductPg.js';
import ProductMongo from '../models/mongo_models/Product.js';
import denormalizeProduct from '../services/denormalizeProduct.js';
import { recordStock } from './stockService.js';

class ProductService {
    static async getProducts() {
        const sqlProducts = await ProductSQL.getProducts();
        return sqlProducts;
    }

    static async getProductById(productId) {
        // Si l'ID est numérique, on tente d'abord la table PostgreSQL
        if (!isNaN(productId)) {
            const sqlProduct = await ProductSQL.getProductById(Number(productId));
            if (sqlProduct) return sqlProduct;
        }

        // Sinon (ou si non trouvé), on regarde dans MongoDB (24 char hex)
        try {
            return await ProductMongo.findById(productId);
        } catch {
            return null;
        }
    }

    static async getProductsByIds(productIds) {
        const paddedProductIds = productIds.map(id => id.toString().padStart(24, '0'));
        return await ProductMongo.find({ _id: { $in: paddedProductIds } });
    }

    static async createProduct(productData) {
        try {
            console.log('Tentative de création de produit:', productData);
            const newSQLProduct = await ProductSQL.createProduct(productData);
            console.log('Produit créé dans PostgreSQL:', newSQLProduct);

            // Dénormaliser et créer dans MongoDB
            await denormalizeProduct(newSQLProduct.id);

            return { newSQLProduct };
        } catch (error) {
            console.error('Erreur dans le service lors de la création du produit:', error);
            throw error;
        }
    }

    static async updateProduct(productId, updateData) {
        try {
            const updatedSQLProduct = await ProductSQL.updateProduct(productId, updateData);

            // Dénormaliser et mettre à jour dans MongoDB
            await denormalizeProduct(updatedSQLProduct.id);

            return { updatedSQLProduct };
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(productId) {
        try {
            const parsedId = parseInt(productId, 10);
            if (isNaN(parsedId)) {
                throw new Error('Invalid product ID');
            }
            const deletedSQLProduct = await ProductSQL.deleteProduct(parsedId);

            // Supprimer également dans MongoDB
            await ProductMongo.findByIdAndDelete(productId);

            return { deletedSQLProduct };
        } catch (error) {
            throw error;
        }
    }

    static async searchProducts(criteria) {
        const sqlProducts = await ProductSQL.searchProducts(criteria);
        return sqlProducts;
    }

    static async getProductsByCategory(category) {
        const sqlProducts = await ProductSQL.getProductsByCategory(category);
        return sqlProducts;
    }

    static async updateProductStock(productId, newStock) {
        try {
            const updatedSQLProduct = await ProductSQL.updateProductStock(productId, newStock);

            // Dénormaliser et mettre à jour le stock dans MongoDB
            await ProductMongo.findByIdAndUpdate(
                productId,
                { stock_available: newStock },
                { new: true }
            );

            await recordStock(productId, newStock);

            return { updatedSQLProduct };
        } catch (error) {
            throw error;
        }
    }

    static async incrementStock(productId, quantity) {
        try {
            const paddedProductId = productId.toString().padStart(24, '0');
            
            // Incrémenter dans PostgreSQL
            const updatedSQLProduct = await ProductSQL.incrementStock(productId, quantity);

            // Incrémenter dans MongoDB
            await ProductMongo.findByIdAndUpdate(
                paddedProductId,
                { $inc: { stock_available: quantity } },
                { new: true }
            );

            return { updatedSQLProduct };
        } catch (error) {
            throw error;
        }
    }
}

export default ProductService;
