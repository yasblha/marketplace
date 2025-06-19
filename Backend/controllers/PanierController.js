import Cart from '../models/postgres_models/Panier.js';
import Client from '../models/postgres_models/UserPg.js';
import Product from '../models/postgres_models/ProductPg.js';
import ProductService from '../services/productService.js';
//import { authenticateAdmin, authenticateToken } from '';


const padProductId = (id) => id.toString().padStart(24, '0');
const removeLeftZeros = (str) => str.replace(/^0+/, '');

export async function createCartItem(req, res) {
    try {
        const { userid, productid, quantity } = req.body;

        let client = null;
        if (userid) {
            client = await Client.findByPk(userid);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
        }

        const paddedProductId = padProductId(productid);
        const product = await ProductService.getProductById(paddedProductId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const quantityNumber = parseInt(quantity, 10);
        if(quantityNumber) {

        }
        if (isNaN(quantityNumber)) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        if (product.stock_available < quantityNumber) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        product.stock_available -= quantityNumber;
        await product.save();

        const reservedUntil = new Date();
        reservedUntil.setMinutes(reservedUntil.getMinutes() + 15);

        const cartItemData = {
            productid: paddedProductId,
            quantity: quantityNumber,
            reservedUntil,
            userid: client ? client.id : userid
        };

        const cartItem = await Cart.create(cartItemData);
        res.status(201).json(cartItem);

        setTimeout(async () => {
            const item = await Cart.findByPk(cartItem.id);
            if (item && new Date() > item.reservedUntil) {
                const productToUpdate = await ProductService.getProductById(item.productid);
                if (productToUpdate) {
                    productToUpdate.stock_available += item.quantity;
                    await productToUpdate.save();
                }
                await item.destroy();
            }
        }, 15 * 60 * 1000);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            where: { userid },
            include: [
                { 
                    model: Client, 
                    attributes: ['id', 'firstname', 'lastname', 'email'],
                    as: 'UserPg'
                },
                { 
                    model: Product, 
                    as: 'ProductPg',
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
            const product = cartItem.ProductPg || {};
            
            return {
                id: cartItem.id,
                userid: cartItem.userid,
                productid: cartItem.productid,
                quantity: cartItem.quantity,
                session_id: cartItem.sessionId,
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
