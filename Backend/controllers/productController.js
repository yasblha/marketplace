//const Product = require('../models/mongo_models/Product');
const Product = require('../services/productService')

async function getAllProducts(req, res) {
    try {
        const products = await Product.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function getProductById(req, res) {
    const id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    try {
        const product = await Product.getProductById(parseInt(id));
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function createProduct(req, res) {
    try {
        const { name, description, category, brand, price, stock_available, status } = req.body;
        const productData = {
            name,
            description,
            category,
            brand,
            price,
            stock_available,
            status
        };

        if (req.file) {
            productData.image = req.file.path;
        }

        const newSQLProduct = await Product.createProduct(productData);
        const newMONGOProduct = await Product.createProduct(productData);

        res.status(201).json({
            message: 'Produit créé avec succès',
            sqlProduct: newSQLProduct,
            mongoProduct: newMONGOProduct,
        });
    } catch (error) {
        console.error('Erreur lors de la création du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function updateProduct(req, res) {
    try {
        const productId = req.params.id;
        const updateData = req.body;
        const updatedProduct = await Product.updateProduct(productId, updateData);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Produit mis à jour avec succès', product: updatedProduct });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function searchProducts(req, res) {
    try {
        const { name, category, brand, minPrice, maxPrice } = req.query;
        const criteria = {};
        if (name) criteria.name = { $regex: new RegExp(name, 'i') };
        if (category) criteria.category = category;
        if (brand) criteria.brand = brand;
        if (minPrice && maxPrice) criteria.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };

        const products = await Product.searchProducts(criteria);
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la recherche de produits :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function getProductsByCategory(req, res) {
    try {
        const category = req.params.category;
        const products = await Product.getProductsByCategory(category);
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits par catégorie :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function updateProductStock(req, res) {
    try {
        const productId = req.params.id;
        const stock = req.body.stock_available;

        const updatedProduct = await Product.updateProduct(productId, { stock_available: stock });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Stock du produit mis à jour avec succès', product: updatedProduct });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du stock du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

module.exports = { updateProductStock ,getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts, getProductsByCategory };