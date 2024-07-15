const mongoose = require('mongoose');
const ProductMongo = require("../models/mongo_models/Product");
const ProductSQL = require("../models/postgres_models/ProductPg");

module.exports = async function denormalizeProduct(productId) {
    try {
        // Récupération du produit depuis PostgreSQL
        const productDenormalized = await ProductSQL.findByPk(productId, {
            attributes: ["id", "name", "description", "category", "brand", "price", "stock_available", "status", "image"]
        });

        if (!productDenormalized) {
            throw new Error('Product not found');
        }

        // Préparation des données pour MongoDB
        const productForMongo = {
            _id: new mongoose.Types.ObjectId(productDenormalized.id.toString().padStart(24, '0')), // Conversion en ObjectId
            name: productDenormalized.name,
            description: productDenormalized.description,
            category: productDenormalized.category,
            brand: productDenormalized.brand,
            price: productDenormalized.price,
            stock_available: productDenormalized.stock_available,
            status: productDenormalized.status,
            image: productDenormalized.image
        };

        // Mise à jour ou insertion du produit dans MongoDB
        const productMongo = await ProductMongo.findByIdAndUpdate(
            productForMongo._id,
            productForMongo,
            {
                upsert: true,
                new: true,
            }
        );

        // Affichage des produits pour vérification
        console.log('Product in PostgreSQL:', productDenormalized.toJSON());
        console.log('Product in MongoDB:', productMongo);

    } catch (error) {
        console.error('Error during denormalization:', error);
        throw error;
    }
};
