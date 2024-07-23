const Order = require('../models/postgres_models/Commande');
const User = require('../models/postgres_models/UserPg');
const Product = require('../models/mongo_models/Product');
const sequelize = require('../config/postgres');

class OrderService {
    static async createOrder(userId, status_order, total_amount, product_ids) {
        const order = await Order.create({
            userId,
            status_order,
            total_amount,
            product_ids
        });
        return order;
    }

    static async getOrderById(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [{ model: User }]
        });
        return order;
    }

    static async updateOrder(orderId, updates) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        Object.assign(order, updates);
        await order.save();
        return order;
    }

    static async deleteOrder(orderId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        await order.destroy();
        return order;
    }

    static async addProductToOrder(orderId, productId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.product_ids.push(productId);
        await order.save();
        return order;
    }

    static async removeProductFromOrder(orderId, productId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.product_ids = order.product_ids.filter(id => id !== productId);
        await order.save();
        return order;
    }

    static async getProductsFromOrder(orderId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        const products = await Product.findAll({
            where: {
                id: {
                    [sequelize.Op.in]: order.product_ids
                }
            }
        });
        return products;
    }
}

module.exports = OrderService;
