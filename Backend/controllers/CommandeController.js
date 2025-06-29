import OrderService from '../services/CommandeServices.js';
import db from '../models/index.js';
import ProductService from '../services/productService.js';
import { sequelizeInstance } from '../config/sequelizeConfig.js';

const Cart = db.Panier;
const Client = db.UserPg;
const sequelize = sequelizeInstance;

// Helper pour gérer l'ID sur 24 caractères (cohérent Mongo-like)
const padProductId = (id) => id.toString().padStart(24, '0');

export async function createOrder(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
        const { userId, statusOrder, totalAmount, products } = req.body;

        // Validation des entrées
        if (!userId || !products?.length) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Données de commande invalides'
            });
        }

        // Vérifier l'existence de l'utilisateur
        const user = await Client.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier les produits et le stock
        for (const { productId, quantity } of products) {
            const product = await ProductService.getProductById(padProductId(productId));
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Produit avec l'ID ${productId} non trouvé`
                });
            }

        }

        // Créer la commande dans une transaction
        const orderId = await OrderService.createOrder(
            userId, 
            statusOrder, 
            totalAmount, 
            products,
            { transaction }
        );

        // Vider le panier dans la même transaction
        await Cart.destroy({ 
            where: { userid: userId },
            transaction 
        });

        // Valider la transaction
        await transaction.commit();


        res.status(201).json({
            success: true,
            data: { orderId }
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Erreur lors de la création de la commande:', error);
        next({
            status: 500,
            message: 'Erreur lors de la création de la commande',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};

export async function getOrderById(req, res, next) {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

        const detailedProducts = await Promise.all(order.details.map(async product => {
            const productDetails = await ProductService.getProductById(product.productId);
            return {
                ...product.toJSON(),
                ...productDetails
            };
        }));

        res.status(200).json({ ...order.toJSON(), details: detailedProducts });
    } catch (error) {
        next(error);
    }
};

export async function getOrders(req, res, next) {
    try {
        const orders = await OrderService.getOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};


export async function updateOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        const updates = req.body;
        const order = await OrderService.updateOrder(orderId, updates);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export async function deleteOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        await OrderService.deleteOrder(orderId);
        res.status(204).json({ message: 'Commande supprimée' });
    } catch (error) {
        next(error);
    }
};

export async function addProductToOrder(req, res, next) {
    try {
        const { orderId, productId } = req.params;
        const { quantity } = req.body;
        const order = await OrderService.addProductToOrder(orderId, productId, quantity);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export async function removeProductFromOrder(req, res, next) {
    try {
        const { orderId, productId } = req.params;
        const order = await OrderService.removeProductFromOrder(orderId, productId);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export async function getProductsFromOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        const products = await OrderService.getProductsFromOrder(orderId);

        const detailedProducts = await Promise.all(products.map(async product => {
            const productDetails = await ProductService.getProductById(product.productId);
            return {
                ...product.toJSON(),
                ...productDetails
            };
        }));

        res.status(200).json(detailedProducts);
    } catch (error) {
        next(error);
    }
};

export async function getOrdersByUserId(req, res, next) {
    try {
        const { userId } = req.params;
        const orders = await OrderService.getOrdersByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};
