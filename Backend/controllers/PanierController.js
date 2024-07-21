const Cart = require('../models/postgres_models/Panier');
const Client = require('../models/postgres_models/Userpg');
//const Product = require('../models/postgres_models/ProductPg');
const Product = require('../models/mongo_models/Product');
//const {authenticateAdmin, authenticateToken} = require('')

exports.createCartItem = async (req, res) => {
    try {
        const { userid, productid, quantity } = req.body;

        // Vérifiez si le client et le produit existent
        const client = await Client.findByPk(userid);
        const product = await Product.findById(productid);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cartItem = await Cart.create({ userid, productid, quantity });
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const { userid } = req.params;
        const cartItems = await Cart.findAll({ where: { userid }, include: [Client, Product] });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const cartItem = await Cart.findByPk(id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await Cart.findByPk(id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.destroy();
        res.status(204).json({ message: 'Cart item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};