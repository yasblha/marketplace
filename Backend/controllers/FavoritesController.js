const Favorite = require('../models/postgres_models/Favorite');
const Client = require('../models/postgres_models/UserPg');
const Product = require('../models/postgres_models/ProductPg');

exports.addFavorite = async (req, res) => {
    try {
        const { userid, productid } = req.body;

        const client = await Client.findByPk(userid);
        const product = await Product.findByPk(productid);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const favorite = await Favorite.create({ userid, productid });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const { userid } = req.params;
        const favorites = await Favorite.findAll({
            where: { userid },
            include: [Product]
        });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { userid, productid } = req.body;

        const favorite = await Favorite.findOne({ where: { userid, productid } });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        await favorite.destroy();
        res.status(204).json({ message: 'Favorite removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
