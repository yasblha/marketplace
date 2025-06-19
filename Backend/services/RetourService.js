import Return from '../models/postgres_models/Returns.js';
import Order from '../models/postgres_models/Commande.js';
import Product from '../models/postgres_models/ProductPg.js';
import Client from '../models/postgres_models/UserPg.js';

export async function createReturn(returnData) {
    try {
        const returnRecord = await Return.create(returnData);
        return returnRecord;
    } catch (error) {
        console.error('Error creating return:', error);
        throw new Error('Failed to create return');
    }
};

export async function getReturnById(id) {
    try {
        const returnRecord = await Return.findByPk(id, {
            include: [Order, Product, Client]
        });
        if (!returnRecord) {
            throw new Error('Return not found');
        }
        return returnRecord;
    } catch (error) {
        console.error('Error fetching return:', error);
        throw new Error('Failed to fetch return');
    }
};

export async function updateReturnStatus(id, status) {
    try {
        const returnRecord = await Return.findByPk(id);
        if (!returnRecord) {
            throw new Error('Return not found');
        }
        returnRecord.status = status;
        await returnRecord.save();
        return returnRecord;
    } catch (error) {
        console.error('Error updating return status:', error);
        throw new Error('Failed to update return status');
    }
};

export async function listReturnsByUserId(userId) {
    try {
        const returns = await Return.findAll({
            where: { userId },
            include: [Order, Product]
        });
        return returns;
    } catch (error) {
        console.error('Error fetching returns:', error);
        throw new Error('Failed to fetch returns');
    }
};

export default {
  createReturn,
  getReturnById,
  updateReturnStatus,
  listReturnsByUserId
};
