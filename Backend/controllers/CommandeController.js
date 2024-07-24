const OrderService = require('../services/CommandeServices');

exports.createOrder = async (req, res) => {
    try {
        const { userId, status_order, total_amount, productIds } = req.body;
        const order = await OrderService.createOrder(userId, status_order, total_amount, productIds);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const updates = req.body;
        const order = await OrderService.updateOrder(orderId, updates);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        await OrderService.deleteOrder(orderId);
        res.status(204).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addProductToOrder = async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const order = await OrderService.addProductToOrder(orderId, productId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeProductFromOrder = async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const order = await OrderService.removeProductFromOrder(orderId, productId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsFromOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const products = await OrderService.getProductsFromOrder(orderId);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
