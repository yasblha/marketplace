import DeliveryAddressService from '../services/DeliveryAdress.js';

export async function createAddress(req, res) {
    try {
        const { userId } = req.body;
        const addressData = req.body;
        const address = await DeliveryAddressService.createAddress(userId, addressData);
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function getAddressById(req, res) {
    try {
        const { addressId } = req.params;
        const address = await DeliveryAddressService.getAddressById(addressId);
        if (!address) return res.status(404).json({ message: 'Address not found' });
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function updateAddress(req, res) {
    try {
        const { addressId } = req.params;
        const updateData = req.body;
        const address = await DeliveryAddressService.updateAddress(addressId, updateData);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function deleteAddress(req, res) {
    try {
        const { addressId } = req.params;
        await DeliveryAddressService.deleteAddress(addressId);
        res.status(204).json({ message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function getAddressesByUserId(req, res) {
    try {
        const { userId } = req.params;
        const addresses = await DeliveryAddressService.getAddressesByUserId(userId);
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
