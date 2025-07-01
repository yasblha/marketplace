import db from '../models/index.js';
import ProductService from '../services/productService.js';
import {Op} from "sequelize";
//import { authenticateAdmin, authenticateToken } from '';

const Cart = db.Panier;
const Client = db.UserPg;
const Product = db.ProductPg;

const padProductId = (id) => id.toString().padStart(24, '0');
const removeLeftZeros = (str) => str.replace(/^0+/, '');

export async function createCartItem(req, res) {
    try {
        const { userid, productid, quantity = 1 } = req.body;

        // Validation des entrées
        if (!productid || !userid) {
            return res.status(400).json({ 
                success: false,
                message: 'productid et userid sont requis' 
            });
        }

        const quantityNum = parseInt(quantity, 10);
        if (isNaN(quantityNum) || quantityNum < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Quantité invalide' 
            });
        }

        // Vérification de l'utilisateur
        const user = await Client.findByPk(userid);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Utilisateur non trouvé' 
            });
        }

        // Récupération du produit
        const paddedProductId = padProductId(productid);
        const product = await ProductService.getProductById(paddedProductId);
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Produit non trouvé' 
            });
        }

        // Vérification du stock
        if (product.stock_available < quantityNum) {
            return res.status(400).json({ 
                success: false,
                message: 'Stock insuffisant', 
                available: product.stock_available 
            });
        }

        // Mise à jour du stock avec verrouillage optimiste
        const updatedStock = product.stock_available - quantityNum;
        const [updated] = await Product.update(
            { stock_available: updatedStock },
            { 
                where: { 
                    id: removeLeftZeros(paddedProductId),
                    stock_available: { [Op.gte]: quantityNum }
                },
                returning: true
            }
        );

        if (!updated) {
            return res.status(400).json({ 
                success: false,
                message: 'Stock insuffisant ou produit modifié' 
            });
        }

        // Création de l'article du panier
        const reservedUntil = new Date();
        reservedUntil.setMinutes(reservedUntil.getMinutes() + 15);

        const cartItem = await Cart.create({
            productid: removeLeftZeros(paddedProductId),
            quantity: quantityNum,
            reservedUntil,
            userid: user.id
        });

        // Libération du stock différée
        const releaseStock = async () => {
            const item = await Cart.findByPk(cartItem.id);
            if (!item) return;

            // Vérifier si l'article est toujours réservé
            if (new Date() > item.reservedUntil) {
                const productToUpdate = await ProductService.getProductById(padProductId(item.productid));
                if (productToUpdate) {
                    // Utiliser une transaction pour la mise à jour du stock
                    await sequelize.transaction(async (t) => {
                        await Product.increment('stock_available', {
                            by: item.quantity,
                            where: { id: item.productid },
                            transaction: t
                        });
                        await item.destroy({ transaction: t });
                    });
                }
            }
        };

        // Planifier la libération du stock
        setTimeout(releaseStock, 15 * 60 * 1000);

        res.status(201).json({ 
            success: true,
            data: {
                id: cartItem.id,
                productid: cartItem.productid,
                quantity: cartItem.quantity,
                reservedUntil: cartItem.reservedUntil
            }
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur serveur',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};

export async function getCartItems(req, res) {
    try {
        const { userid } = req.params;
        
        // Vérifier d'abord si l'utilisateur existe
        const user = await Client.findByPk(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Récupérer les articles du panier
        const cartItems = await Cart.findAll({ 
            where:{ userid },
            include: [
                { 
                    model: Client,
                    attributes: ['id', 'firstname', 'lastname', 'email'],
                    as: 'User'
                },
                { 
                    model: Product, 
                    as: 'Product',
                    attributes: ['id', 'name', 'price', 'image']
                }
            ]
        });

        // Si l'utilisateur n'a pas de panier, retourner un tableau vide
        if (!cartItems || cartItems.length === 0) {
            return res.status(200).json([]);
        }

        // Mapper les articles du panier avec les produits correspondants
        const cartItemsWithProducts = cartItems.map(cartItem => {
            // Utiliser le produit inclus dans la requête ou un objet vide
            const product = cartItem.Product || {};
            
            return {
                id: cartItem.id,
                userid: cartItem.userid,
                productid: cartItem.productid,
                quantity: cartItem.quantity,
                reserved_until: cartItem.reservedUntil,
                created_at: cartItem.createdAt,
                updated_at: cartItem.updatedAt,
                product: product ? {
                    _id: product.id.toString(),
                    name: product.name,
                    price: product.price,
                    image: product.image || null
                } : null,
                user: cartItem.UserPg ? {
                    id: cartItem.UserPg.id,
                    firstname: cartItem.UserPg.firstname,
                    lastname: cartItem.UserPg.lastname,
                    email: cartItem.UserPg.email
                } : null
            };
        });

        res.status(200).json(cartItemsWithProducts);
    } catch (error) {
        console.error('Error in getCartItems:', error);
        res.status(500).json({ 
            message: 'Error retrieving cart items',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export async function updateCartItem(req, res) {
    try {
        const { userid, quantity, productid } = req.body;
        const { id } = req.params;

        const prodId = removeLeftZeros(id || productid);

        const cartItem = await Cart.findOne({ where: { userid, productid: prodId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        const product = await ProductService.getProductById(padProductId(cartItem.productid));
        const quantityNumber = parseInt(quantity, 10);
        if (isNaN(quantityNumber)) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const stockDifference = quantityNumber - cartItem.quantity;

        if (product.stock_available < stockDifference) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        product.stock_available -= stockDifference;
        await product.save();

        cartItem.quantity = quantityNumber;
        cartItem.reservedUntil = new Date();
        cartItem.reservedUntil.setMinutes(cartItem.reservedUntil.getMinutes() + 15);
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function deleteCartItem(req, res) {
    try {
        const { id } = req.params;
        console.log(id);

        //const removeLeftZeros = (str) => str.replace(/^0+/, '');
        //const originalString = "000000000000000000000132";
        const ProductId = removeLeftZeros(id);
        console.log('idproduit',ProductId);

        const cartItem = await Cart.findOne({ where: { productid: ProductId } });
        console.log('idproduitpanier',cartItem);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const product = await ProductService.getProductById(padProductId(cartItem.productid));
        if (product) {
            product.stock_available += cartItem.quantity;
            await product.save();
        }

        await cartItem.destroy();
        res.status(204).json({ message: 'Cart item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function clearCart(req, res) {
    try {
        const { userid } = req.params;

        const items = await Cart.findAll({ where: { userid } });

        if (!items.length) {
            return res.status(200).json({ success: true, message: 'Panier déjà vide' });
        }

        // Restituer le stock pour chaque produit
        for (const item of items) {
            await Product.increment('stock_available', {
                by: item.quantity,
                where: { id: item.productid }
            });
        }

        await Cart.destroy({ where: { userid } });

        res.status(200).json({ success: true, message: 'Panier vidé' });
    } catch (error) {
        console.error('Erreur clearCart:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};
