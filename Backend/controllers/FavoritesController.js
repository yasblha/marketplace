const Favorite = require('../models/postgres_models/Favorite');
const Product = require('../models/postgres_models/ProductPg');

exports.addProductToFavorites = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Créer une nouvelle entrée de favoris pour l'utilisateur et le produit
        const [favorite, created] = await Favorite.findOrCreate({
            where: { userid: userId, productid: productId }
        });

        if (!created) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }

        res.status(200).json(favorite);
    } catch (error) {
        console.error('Error adding product to favorites:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getFavoritesByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const favorites = await Favorite.findAll({ where: { userid: userId } });

        if (!favorites.length) {
            return res.status(404).json({ message: 'No favorites found for this user' });
        }

        const productIds = favorites.map(fav => fav.productid);
        const products = await Product.findAll({
            where: {
                id: productIds
            }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.removeFavorite = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const favorite = await Favorite.findOne({ where: { userid: userId, productid: productId } });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        await favorite.destroy();

        res.status(204).json({ message: 'Favorite removed' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
