const DeliveryAddress = require('../models/postgres_models/AdresseLivraison');

class DeliveryAddressService {
    static async createAddress(userId, addressData) {
        return DeliveryAddress.create({ ...addressData, user_id: userId });
    }

    static async getAddressById(addressId) {
        return DeliveryAddress.findByPk(addressId);
    }

    static async updateAddress(addressId, updateData) {
        const address = await DeliveryAddress.findByPk(addressId);
        if (!address) throw new Error('Address not found');

        Object.assign(address, updateData);
        await address.save();
        return address;
    }

    static async deleteAddress(addressId) {
        const address = await DeliveryAddress.findByPk(addressId);
        if (!address) throw new Error('Address not found');

        await address.destroy();
        return address;
    }

    static async getAddressesByUserId(userId) {
        return DeliveryAddress.findAll({ where: { user_id: userId } });
    }
}

module.exports = DeliveryAddressService;
