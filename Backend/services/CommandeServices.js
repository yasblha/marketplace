import db from '../models/index.js';
import Product from '../models/mongo_models/Product.js';
import ProductService from './productService.js';
import { sequelizeInstance } from '../config/sequelizeConfig.js';
import { Op } from 'sequelize';
import ORDER_STATUS from '../constants/orderStatus.js';

const Order = db.Commande;
const OrderDetails = db.DetailsCommande;
const User = db.UserPg;
const ProductPg = db.ProductPg;
const sequelize = sequelizeInstance;

const padProductId = (id) => id.toString().padStart(24, '0');
const removeLeftZeros = (str) => str.toString().replace(/^0+/, '');

class OrderService {
    static async createOrder(userId, statusOrder, totalAmount, products, { transaction } = {}) {
        const t = transaction || await sequelize.transaction();
        let shouldCommit = !transaction; // Si on a reçu une transaction, on ne commit pas ici

        try {
            // Valider le statut de la commande
            const validStatus = Object.values(ORDER_STATUS).includes(statusOrder)
                ? statusOrder
                : ORDER_STATUS.PENDING;

            // Créer la commande
            const order = await Order.create({
                userId,
                statusOrder: validStatus,
                totalAmount,
                dateOrder: new Date()
            }, { transaction: t });

            console.log('Commande créée avec succès:', order.id);

            // Traiter chaque produit de la commande
            for (const { productId, quantity } of products) {
                const paddedProductId = padProductId(productId);
                
                // Récupérer les infos dans les deux bases
                const productMongo = await Product.findById(paddedProductId).lean();
                const sqlProd = await ProductPg.findByPk(Number(productId), { transaction: t });

                if (!sqlProd) {
                    throw new Error(`Produit avec l'ID ${productId} non trouvé`);
                }

                const baseProduct = {
                    name           : sqlProd.name,
                    description    : sqlProd.description || '',
                    category       : sqlProd.category || '',
                    brand          : sqlProd.brand || '',
                    price          : sqlProd.price,
                    stock_available: sqlProd.stock_available
                };

                // Vérifier le stock disponible dans Postgres avant de décrémenter
                if (sqlProd.stock_available < quantity) {
                    throw new Error(`Stock insuffisant pour le produit: ${sqlProd.name}`);
                }

                // Décrémenter dans Postgres (transactionnel)
                const [affected] = await ProductPg.update(
                    { stock_available: sequelize.literal(`stock_available - ${quantity}`) },
                    { where: { id: Number(productId), stock_available: { [Op.gte]: quantity } }, transaction: t }
                );
                if (!affected) {
                    throw new Error(`Stock insuffisant pour le produit: ${sqlProd.name}`);
                }

                // Décrémenter dans Mongo le cas échéant (meilleur effort)
                if (productMongo) {
                    const updated = await Product.updateOne(
                        { _id: paddedProductId, stock_available: { $gte: quantity } },
                        { $inc: { stock_available: -quantity } }
                    );
                    if (!updated.matchedCount) {
                        // Revenir en arrière sur Postgres
                        await ProductPg.update(
                            { stock_available: sequelize.literal(`stock_available + ${quantity}`) },
                            { where: { id: Number(productId) }, transaction: t }
                        );
                        throw new Error(`Stock insuffisant (Mongo) pour le produit: ${sqlProd.name}`);
                    }
                }

                // Log détaillé avant insertion
                console.log('Insertion OrderDetails:', {
                  orderId: order.id,
                  productId: Number(productId),
                  productName: baseProduct.name,
                  productDescription: baseProduct.description,
                  productCategory: baseProduct.category,
                  productBrand: baseProduct.brand,
                  unitPrice: baseProduct.price,
                  quantity,
                  subtotal: baseProduct.price * quantity
                });

                // Créer le détail de la commande avec les bons noms de champs
                await OrderDetails.create({
                    orderId: order.id,
                    productId: Number(productId),
                    productName: baseProduct.name,
                    productDescription: baseProduct.description,
                    productCategory: baseProduct.category,
                    productBrand: baseProduct.brand,
                    unitPrice: baseProduct.price,
                    quantity,
                    subtotal: baseProduct.price * quantity
                }, { transaction: t });

                console.log('Détail de commande créé avec succès pour le produit:', productId);
            }

            // Valider la transaction si on l'a créée ici
            if (shouldCommit) {
                await t.commit();
                console.log('Transaction validée avec succès');
            }

            return order.id;

        } catch (error) {
            // Annuler la transaction en cas d'erreur
            if (shouldCommit && t) {
                await t.rollback();
                console.log('Transaction annulée');
            }
            console.error('Erreur lors de la création de la commande:', error);
            if (error.parent) {
                console.error('Détail PG:', error.parent.detail);
                console.error('Message PG:', error.parent.message);
                console.error('Code PG:', error.parent.code);
            }
            throw error; // Propager l'erreur pour une gestion plus haut niveau
        }
    }

    static async getOrderById(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [
                { model: User, as: 'user' },
                { model: OrderDetails, as: 'details' }
            ]
        });

        if (order && order.details) {
            order.details.forEach(d => { d.productId = padProductId(d.productId) })
        }

        return order;
    }

    static async updateOrder(orderId, updates) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        if (updates.statusOrder && !Object.values(ORDER_STATUS).includes(updates.statusOrder)) {
            throw new Error('Statut de commande invalide');
        }

        Object.assign(order, updates);
        await order.save();
        return order;
    }

    static async deleteOrder(orderId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        await order.destroy();
        return order;
    }

    static async addProductToOrder(orderId, productId, quantity) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        const paddedProductId = padProductId(productId);
        let product = await Product.findById(paddedProductId);
        if (!product) {
            // tenter côté Postgres (ID numérique)
            const sqlProd = await ProductPg.getProductById(Number(productId));
            if (!sqlProd) throw new Error('Produit non trouvé');

            // créer une instance temporaire mimant le schéma Mongo pour réutiliser la suite du code
            product = {
                _id   : paddedProductId,
                name  : sqlProd.name,
                description: sqlProd.description || '',
                category: sqlProd.category || '',
                brand : sqlProd.brand || '',
                price : sqlProd.price,
                stock_available: sqlProd.stock_available ?? 9999
            };
        }

        await OrderDetails.create({
            orderId: order.id,
            productId: paddedProductId,
            productName: product.name,
            productDescription: product.description,
            productCategory: product.category,
            productBrand: product.brand,
            unitPrice: product.price,
            quantity,
        });

        return order;
    }

    static async removeProductFromOrder(orderId, productId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Commande non trouvée');

        const paddedProductId = padProductId(productId);
        const orderDetail = await OrderDetails.findOne({ where: { orderId, productId: paddedProductId } });
        if (orderDetail) {
            await orderDetail.destroy();
        }

        return order;
    }

    static async getProductsFromOrder(orderId) {
        const order = await Order.findByPk(orderId, {
            include: { model: OrderDetails, as: 'details' }
        });
        if (!order) throw new Error('Commande non trouvée');

        order.details.forEach(detail => {
            detail.productId = removeLeftZeros(detail.productId);
        });

        return order.details;
    }

    static async getOrderDetails(orderId) {
        const details = await OrderDetails.findAll({
            where: { orderId }
        });

        return details.map(detail => ({
            ...detail.toJSON(),
            productId: padProductId(detail.productId)
        }));
    }

    static async getOrders() {
        const orders = await Order.findAll({
            include: [{
                model: OrderDetails,
                as: 'details'
            }],
            order: [['dateOrder', 'DESC']]
        });

        // Formater les données pour le frontend
        const formattedOrders = orders.map(order => ({
            id: order.id,
            dateOrder: order.dateOrder,
            statusOrder: order.statusOrder,
            totalAmount: order.totalAmount,
            userId: order.userId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            details: order.details ? order.details.map(detail => ({
                ...detail.toJSON(),
                productId: padProductId(detail.productId)
            })) : []
        }));

        return formattedOrders;
    }

    static async getOrdersByUserId(userId) {
        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: OrderDetails,
                as: 'details'
            }],
            order: [['dateOrder', 'DESC']]
        });

        // Formater les données pour le frontend
        const formattedOrders = orders.map(order => ({
            id: order.id,
            dateOrder: order.dateOrder,
            statusOrder: order.statusOrder,
            totalAmount: order.totalAmount,
            userId: order.userId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            details: order.details ? order.details.map(detail => ({
                ...detail.toJSON(),
                productId: padProductId(detail.productId)
            })) : []
        }));

        return formattedOrders;
    }
}

export default OrderService;
