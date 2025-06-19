import Order from '../models/postgres_models/Commande.js';
import OrderDetails from '../models/postgres_models/DetailsCommande.js';
import User from '../models/postgres_models/UserPg.js';
import Product from '../models/mongo_models/Product.js';
import sequelize from '../config/postgres.js';
import ORDER_STATUS from '../constants/orderStatus.js';

const padProductId = (id) => id.toString().padStart(24, '0');
const removeLeftZeros = (str) => str.toString().replace(/^0+/, '');

class OrderService {
    static async createOrder(userId, statusOrder, totalAmount, products) {
        return sequelize.transaction(async (transaction) => {
            const validStatus = Object.values(ORDER_STATUS).includes(statusOrder)
                ? statusOrder
                : ORDER_STATUS.PENDING;

            const order = await Order.create({
                userId,
                statusOrder: validStatus,
                totalAmount,
            }, { transaction });

            for (const { productId, quantity } of products) {
                const paddedProductId = padProductId(productId);
                const product = await Product.findById(paddedProductId);
                if (!product) {
                    throw new Error(`Produit avec l'ID ${productId} non trouvé`);
                }

                const newStock = product.stock_available - quantity;
                if (newStock < 0) {
                    throw new Error(`Stock insuffisant pour le produit avec l'ID ${productId}`);
                }

                await Product.findByIdAndUpdate(paddedProductId, { stock_available: newStock }, { new: true });

                await OrderDetails.create({
                    orderId: order.id,
                    productId: paddedProductId,
                    productName: product.name,
                    productDescription: product.description,
                    productCategory: product.category,
                    productBrand: product.brand,
                    unitPrice: product.price,
                    quantity,
                }, { transaction });
            }

            return order.id;
        });
    }

    static async getOrderById(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [
                { model: User },
                { 
                    model: OrderDetails,
                    as: 'details'
                }
            ]
        });

        if (order) {
            order.OrderDetails.forEach(detail => {
                detail.productId = padProductId(detail.productId);
            });
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
        const product = await Product.findById(paddedProductId);
        if (!product) throw new Error('Produit non trouvé');

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
            include: { model: OrderDetails }
        });
        if (!order) throw new Error('Commande non trouvée');

        order.details.forEach(detail => {
            detail.productId = removeLeftZeros(detail.productId);
        });

        return order.details;
    }

    static async getOrders() {
        const orders = await Order.findAll({
            include: [{
                model: OrderDetails,
                as: 'details'  // Corrigé pour correspondre à l'alias défini dans l'association
            }],
            order: [['dateOrder', 'DESC']]  // Corrigé pour utiliser le nom du champ JavaScript
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
            OrderDetails: order.OrderDetails ? order.OrderDetails.map(detail => ({
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
            order: [['date_order', 'DESC']]
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
            OrderDetails: order.OrderDetails ? order.OrderDetails.map(detail => ({
                ...detail.toJSON(),
                productId: padProductId(detail.productId)
            })) : []
        }));

        return formattedOrders;
    }
}

export default OrderService;
