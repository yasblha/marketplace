import ProductSQL from '../models/postgres_models/ProductPg.js';
import ProductMongo from '../models/mongo_models/Product.js';
import denormalizeProduct from '../services/denormalizeProduct.js';
import { recordStock } from './stockService.js';
import { Op } from 'sequelize';

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

    static async searchProducts(criteria, orderOptions = []) {
        try {
            console.log('Service productService - critères reçus:', criteria);
            
            // Adaptation des critères pour PostgreSQL
            const sequelizeCriteria = {};
            
            // Filtres textuels avec recherche partielle
            if (criteria.name) {
                sequelizeCriteria.name = { [Op.iLike]: `%${criteria.name}%` };
            }
            
            if (criteria.category) {
                sequelizeCriteria.category = criteria.category;
            }
            
            if (criteria.brand) {
                sequelizeCriteria.brand = criteria.brand;
            }
            
            // Filtres de prix avec plage min/max - CORRECTION pour prix minimum
            if (criteria.minPrice || criteria.maxPrice) {
                sequelizeCriteria.price = {};
                
                if (criteria.minPrice !== undefined) {
                    const minPriceValue = parseFloat(criteria.minPrice);
                    console.log(`Filtre prix minimum appliqué: ${minPriceValue}`);
                    if (!isNaN(minPriceValue)) {
                        sequelizeCriteria.price[Op.gte] = minPriceValue;
                    }
                }
                
                if (criteria.maxPrice !== undefined) {
                    const maxPriceValue = parseFloat(criteria.maxPrice);
                    console.log(`Filtre prix maximum appliqué: ${maxPriceValue}`);
                    if (!isNaN(maxPriceValue)) {
                        sequelizeCriteria.price[Op.lte] = maxPriceValue;
                    }
                }
                
                // Si aucun filtre de prix valide, supprimer l'objet vide
                if (Object.keys(sequelizeCriteria.price).length === 0) {
                    delete sequelizeCriteria.price;
                }
            }
            
            // Filtres additionnels
            if (criteria.is_on_sale !== undefined) {
                sequelizeCriteria.is_on_sale = criteria.is_on_sale;
            }
            
            if (criteria.in_stock !== undefined) {
                sequelizeCriteria.stock_available = { [Op.gt]: 0 };
            }
            
            console.log('Service productService - critères SQL transformés:', 
                JSON.stringify(sequelizeCriteria, null, 2));
            
            // Options de requête
            const options = { where: sequelizeCriteria };
            
            // Ajout d'options de tri si spécifiées
            if (orderOptions.length === 2) {
                options.order = [[orderOptions[0], orderOptions[1]]];
            }
            
            // Trouver les produits
            const products = await ProductSQL.findAll(options);
            
            // Log de vérification pour le prix
            if (criteria.minPrice !== undefined) {
                const minPrice = parseFloat(criteria.minPrice);
                console.log(`Vérification filtre prix minimum ${minPrice}:`);
                console.log(`Produits avec prix < ${minPrice}:`, 
                    products.filter(p => parseFloat(p.price) < minPrice).length);
                console.log(`Produits avec prix >= ${minPrice}:`, 
                    products.filter(p => parseFloat(p.price) >= minPrice).length);
            }
            
            return products;
        } catch (error) {
            console.error('Erreur dans le service productService.searchProducts:', error);
            throw error;
        }
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

    static async searchProductsByMongoDB(query) {
        return await ProductMongo.find(query);
    }

    static async getDistinctCategories() {
        try {
            // Récupérer les catégories des produits PostgreSQL
            const sqlCategories = await ProductSQL.findAll({
                attributes: [[ProductSQL.sequelize.fn('DISTINCT', ProductSQL.sequelize.col('category')), 'category']],
                where: {
                    category: {
                        [Op.not]: null,
                        [Op.ne]: ''
                    }
                },
                raw: true
            });
            
            // Extraire uniquement les valeurs des catégories
            const categories = sqlCategories.map(item => item.category);
            
            // Récupérer les catégories des produits MongoDB (si nécessaire)
            // Ceci est un exemple, à adapter selon la structure de la base MongoDB
            try {
                const mongoCategories = await ProductMongo.distinct('category', { 
                    category: { $exists: true, $ne: '' } 
                });
                
                // Combiner les catégories des deux sources et éliminer les doublons
                const allCategories = [...new Set([...categories, ...mongoCategories])];
                return allCategories.filter(Boolean).sort(); // Filtrer les valeurs null/undefined/empty et trier
            } catch (mongoError) {
                console.log('Impossible de récupérer les catégories MongoDB, retour des catégories SQL uniquement:', mongoError);
                return categories.filter(Boolean).sort();
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            throw error;
        }
    }
}

export default ProductService;
