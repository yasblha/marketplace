import Product from '../services/productService.js';
import denormalizeProduct from '../services/denormalizeProduct.js';
import Media from '../models/postgres_models/Media.js';
import multer from 'multer';
import upload from '../middleware/upload.js';
import { faker } from '@faker-js/faker';
//import ProductPg from '../models/postgres_models/ProductPg.js';


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
        const product = await Product.getProductById(id);
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
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier' });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        try {
            const { name, description, category, brand, price, stock_available, status } = req.body;
            const productData = {
                name,
                description,
                category,
                brand,
                price,
                stock_available,
                status,
                images: []
            };

            if (req.files && req.files.length > 0) {
                productData.images = req.files.map(file => file.path);
            }

            const newProduct = await Product.createProduct(productData);
            const productId = newProduct.newSQLProduct.id;

            if (productData.images.length > 0) {
                const now = new Date();
                const mediaData = productData.images.map(path => ({
                    productId,
                    path,
                    created_at: now,
                    updated_at: now
                }));
                await Media.bulkCreate(mediaData);
            }

            await denormalizeProduct(newProduct.newSQLProduct.id); // Dénormalisation
            res.status(201).json({
                message: 'Produit créé avec succès',
                product: newProduct,
            });
        } catch (error) {
            console.error('Erreur lors de la création du produit :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    });
}


async function uploadProductImages(req, res) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier' });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        try {
            const { productId } = req.body;
            const now = new Date();
            const mediaData = req.files.map(file => ({
                productId,
                path: file.path,
                created_at: now,
                updated_at: now
            }));

            await Media.bulkCreate(mediaData);
            res.status(201).json({ message: 'Images uploadées avec succès' });
        } catch (error) {
            console.error('Erreur lors de l\'upload des images :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    });
}


async function updateProduct(req, res) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier' });
        } else if (err) {
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        try {
            const productId = req.params.id.replace(/^(0+)/g, '');
            console.log(productId);
            const { name, description, category, brand, price, stock_available, status } = req.body;
            const updateData = {
                name,
                description,
                category,
                brand,
                price,
                stock_available,
                status,
                images: []
            };

            if (req.files && req.files.length > 0) {
                updateData.images = req.files.map(file => file.path);
            }

            const updatedProduct = await Product.updateProduct(productId, updateData);
            console.log(updateData, 'dataupdated')
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            await denormalizeProduct(updatedProduct.updatedSQLProduct.id); // Dénormalisation
            res.status(200).json({ message: 'Produit mis à jour avec succès', product: updatedProduct });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    });
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
        console.log('Requête de recherche reçue:', req.query);
        
        const { 
            name, 
            category, 
            brand, 
            minPrice, 
            maxPrice,
            is_on_sale,
            in_stock,
            sort
        } = req.query;
        
        const criteria = {};
        
        // Gestion des filtres principaux
        if (name) criteria.name = name;
        if (category) criteria.category = category;
        if (brand) criteria.brand = brand;
        if (minPrice) criteria.minPrice = parseFloat(minPrice);
        if (maxPrice) criteria.maxPrice = parseFloat(maxPrice);
        
        // Gestion des filtres supplémentaires
        if (is_on_sale === 'true') criteria.is_on_sale = true;
        if (in_stock === 'true') criteria.in_stock = true;
        
        console.log('Critères de recherche appliqués:', criteria);
        
        // Gestion du tri (optionnel)
        let orderOptions = [];
        if (sort) {
            const [field, direction] = sort.split(':');
            if (field && (direction === 'asc' || direction === 'desc')) {
                orderOptions = [field, direction];
            }
        }
        
        const products = await Product.searchProducts(criteria, orderOptions);
        console.log(`${products.length} produits trouvés`);
        
        // S'assurer que les images sont correctement formatées
        const formattedProducts = products.map(product => {
            // Convertir en objet simple pour manipuler
            const productObj = product.toJSON ? product.toJSON() : {...product};
            
            // S'assurer que image est toujours un tableau
            if (!productObj.image) {
                productObj.image = [];
            } else if (!Array.isArray(productObj.image)) {
                // Si image n'est pas un tableau, le convertir en tableau
                productObj.image = [productObj.image];
            }
            
            // Filtrer les images invalides (comme "{}")
            productObj.image = productObj.image
                .filter(img => img && typeof img === 'string' && img !== '{}')
                .map(img => img.trim());
                
            return productObj;
        });
        
        // Préparer les facettes pour la réponse
        const facets = {
            categories: [...new Set(formattedProducts.map(p => p.category).filter(Boolean))],
            brands: [...new Set(formattedProducts.map(p => p.brand).filter(Boolean))],
            priceRange: {
                min: formattedProducts.length > 0 ? Math.min(...formattedProducts.map(p => parseFloat(p.price) || 0)) : 0,
                max: formattedProducts.length > 0 ? Math.max(...formattedProducts.map(p => parseFloat(p.price) || 0)) : 0
            },
            hasPromotions: formattedProducts.some(p => p.is_on_sale),
            hasInStock: formattedProducts.some(p => p.stock_available > 0)
        };
        
        // Renvoyer un objet avec la propriété "products" contenant le tableau des produits
        res.status(200).json({
            products: formattedProducts,
            facets,
            totalResults: formattedProducts.length,
            appliedFilters: criteria
        });
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

        const updatedProduct = await Product.updateProductStock(productId, { stock_available: stock });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        await denormalizeProduct(updatedProduct.updatedSQLProduct.id);
        res.status(200).json({ message: 'Stock du produit mis à jour avec succès', product: updatedProduct });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du stock du produit :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

async function injectProducts(req, res) {
    try {
        for (let i = 0; i < 20; i++) {
            const productData = {
                name: faker.commerce.productName(),
                description: faker.lorem.paragraph(),
                category: faker.commerce.department(),
                brand: faker.company.name(),
                price: parseFloat(faker.commerce.price()),
                stock_available: faker.number.int({ min: 1, max: 100 }),
                status: 'available',
                images: ['/Users/yassineboulahnine/Desktop/Projects/marketplace/logoMammba.png']
            };

            // Appeler la fonction createProduct pour créer le produit
            await Product.createProduct(productData);
            console.log(`Produit ajouté: ${productData.name}`);
        }

        console.log('20 produits ont été ajoutés à la base de données.');
        res.status(200).json({ message: '20 produits ont été ajoutés à la base de données.' });
    } catch (error) {
        console.error('Erreur lors de l\'injection des produits:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Fonction pour récupérer toutes les catégories de produits distinctes
async function getProductCategories(req, res) {
    try {
        console.log('Récupération des catégories de produits');
        const categories = await Product.getDistinctCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories de produits:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

export {
    updateProductStock,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory,
    injectProducts,
    uploadProductImages,
    getProductCategories // Ajout de l'export pour la nouvelle fonction
};
