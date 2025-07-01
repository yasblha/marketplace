import DeliveryAddress from '../models/postgres_models/AdresseLivraison.js';

class DeliveryAddressService {
  static async createAddress(userId, data) {
    return DeliveryAddress.create({ ...data, UserId: userId });   // <-- casse unique
  }

  static async getAddressById(id) {
    return DeliveryAddress.findByPk(id);
  }

  static async updateAddress(id, data) {
    const addr = await DeliveryAddress.findByPk(id);
    if (!addr) throw new Error('Address not found');

    const { line1, line2, city, zip, country } = data;            // champs autorisés
    Object.assign(addr, { line1, line2, city, zip, country });
    return addr.save();
  }

  static async deleteAddress(id) {
    const addr = await DeliveryAddress.findByPk(id);
    if (!addr) throw new Error('Address not found');
    await addr.destroy();
  }

  static async getAddressesByUserId(userId) {
    return DeliveryAddress.findAll({ where: { userId: userId } }); // <-- même casse
  }
}

export default DeliveryAddressService;
