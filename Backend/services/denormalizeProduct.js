import mongoose from 'mongoose';
import ProductMongo from '../models/mongo_models/Product.js';
import ProductSQL from '../models/postgres_models/ProductPg.js';
import Media from '../models/postgres_models/Media.js';

export default async function denormalizeProduct(productId) {
    try {
        // Récupération du produit depuis PostgreSQL
        const productDenormalized = await ProductSQL.findByPk(productId, {
            attributes: ["id", "name", "description", "category", "brand", "price", "stock_available", "status", "image"]
        });

        if (!productDenormalized) {
            throw new Error('Product not found');
        }

        const images = await Media.findAll({
            where: { productId: productId },
            attributes: ["path"]
        });

        //const imagePaths = images.map(image => image.path);
        const imagePaths = images.map(image => {
            const fullPath = image.dataValues.path;
            const uploadsIndex = fullPath.indexOf('uploads/');
            return uploadsIndex !== -1
                ? fullPath.substring(uploadsIndex)
                : fullPath;
        });        console.log('images paths',imagePaths);
        console.log('tpoutes les images',images);

        // Vérifier d'abord si le produit existe déjà
        const existingProduct = await ProductMongo.findOne({ postgres_id: productDenormalized.id });
        
        // Préparation des données pour MongoDB
        const productData = {
            postgres_id: productDenormalized.id,
            name: productDenormalized.name,
            description: productDenormalized.description,
            category: productDenormalized.category,
            brand: productDenormalized.brand,
            price: productDenormalized.price,
            stock_available: productDenormalized.stock_available,
            status: productDenormalized.status,
            images: imagePaths || []
        };

        let productMongo;

        if (existingProduct) {
            // Mise à jour du produit existant
            productMongo = await ProductMongo.findOneAndUpdate(
                { _id: existingProduct._id },
                { $set: productData },
                { new: true }
            );
        } else {
            // Création d'un nouveau produit avec un _id basé sur l'ID PostgreSQL
            productMongo = await ProductMongo.create({
                _id: `pg_${productDenormalized.id}`,
                ...productData
            });
        }

        // Affichage des produits pour vérification
        console.log('Product in PostgreSQL:', productDenormalized.toJSON());
        console.log('Product in MongoDB:', productMongo);

    } catch (error) {
        console.error('Error during denormalization:', error);
        throw error;
    }
};
