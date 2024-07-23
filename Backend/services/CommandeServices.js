//const Order = require('../models/postgres_models/Commande');
//const User = require('../models/postgres_models/UserPg');
//const OrderDetail = require('../models/postgres_models/DetailsCommande');
//const Product = require('../models/mongo_models/Product');
//const sequelize = require('../config/postgres');

class OrderService {
    static async createOrder(userId, status_order, total_amount, product_ids) {
        return sequelize.transaction(async (transaction) => {
            const order = await Order.create({
                userId,
                status_order,
                total_amount,
                product_ids
            }, { transaction });

            for (const productId of product_ids) {
                const product = await Product.findById(productId);
                if (!product) {
                    throw new Error(`Product with ID ${productId} not found`);
                }

                const newStock = product.stock_available - 1; // Assuming each order decreases stock by 1
                if (newStock < 0) {
                    throw new Error(`Not enough stock for product with ID ${productId}`);
                }

                await Product.findByIdAndUpdate(productId, { stock_available: newStock }, { new: true });

                await OrderDetail.create({
                    order_id: order.id,
                    product_id: productId,
                    quantity: 1, // Assuming a quantity of 1 for each product, adjust as needed
                    unit_price: product.price
                }, { transaction });
            }

            return order;
        });
    }

    static async getOrderById(orderId) {
        const order = await Order.findByPk(orderId, {
            include: [
                { model: User },
                {
                    model: OrderDetail,
                    include: [Product]
                }
            ]
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

        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');

        order.product_ids.push(productId);
        await order.save();

        await OrderDetail.create({
            order_id: order.id,
            product_id: productId,
            quantity: 1, // Assuming a quantity of 1, adjust as needed
            unit_price: product.price
        });

        return order;
    }

    static async removeProductFromOrder(orderId, productId) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        order.product_ids = order.product_ids.filter(id => id !== productId);
        await order.save();

        const orderDetail = await OrderDetail.findOne({ where: { order_id: orderId, product_id: productId } });
        if (orderDetail) {
            await orderDetail.destroy();
        }

        return order;
    }

    static async getProductsFromOrder(orderId) {
        const order = await Order.findByPk(orderId, {
            include: {
                model: OrderDetail,
                include: [Product]
            }
        });
        if (!order) throw new Error('Order not found');

        return order.OrderDetails;
    }
}

module.exports = OrderService;
