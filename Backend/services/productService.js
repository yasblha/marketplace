const ProductSQL = require('../models/postgres_models/ProductPg');
const ProductMongo = require('../models/mongo_models/Product');

class ProductService {
    static async getProducts() {
        const sqlProducts = await ProductSQL.getProducts();
        const mongoProducts = await ProductMongo.find();
        return { sqlProducts, mongoProducts };
    }

    static async getProductById(productId) {
        const sqlProduct = await ProductSQL.getProductById(productId);
        const mongoProduct = await ProductMongo.findById(productId);
        return { sqlProduct, mongoProduct };
    }

    static async createProduct(productData) {
        try {
            console.log('Tentative de création de produit:', productData);
            const newSQLProduct = await ProductSQL.createProduct(productData);
            console.log('Produit créé dans PostgreSQL:', newSQLProduct);
            const newMongoProduct = await ProductMongo.create(productData);
            console.log('Produit créé dans MongoDB:', newMongoProduct);
            return { newSQLProduct, newMongoProduct };
            //return { newSQLProduct }
        } catch (error) {
            console.error('Erreur dans le service lors de la création du produit:', error);
            throw error;
        }
    }

    static async updateProduct(productId, updateData) {
        try {
            const updatedSQLProduct = await ProductSQL.updateProduct(productId, updateData);
            const updatedMongoProduct = await ProductMongo.findByIdAndUpdate(productId, updateData, { new: true });
            return { updatedSQLProduct, updatedMongoProduct };
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(productId) {
        try {
            const deletedSQLProduct = await ProductSQL.deleteProduct(productId);
            const deletedMongoProduct = await ProductMongo.findByIdAndDelete(productId);
            return { deletedSQLProduct, deletedMongoProduct };
        } catch (error) {
            throw error;
        }
    }

    static async searchProducts(criteria) {
        const sqlProducts = await ProductSQL.searchProducts(criteria);
        const mongoProducts = await ProductMongo.find(criteria);
        return { sqlProducts, mongoProducts };
    }

    static async getProductsByCategory(category) {
        const sqlProducts = await ProductSQL.getProductsByCategory(category);
        const mongoProducts = await ProductMongo.find({ category });
        return { sqlProducts, mongoProducts };
    }

    static async updateProductStock(productId, newStock) {
        try {
            const updatedSQLProduct = await ProductSQL.updateProductStock(productId, newStock);
            const updatedMongoProduct = await ProductMongo.findByIdAndUpdate(
                productId,
                { stock_available: newStock },
                { new: true }
            );
            return { updatedSQLProduct, updatedMongoProduct };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductService;