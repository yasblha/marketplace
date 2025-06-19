import Payment from '../models/postgres_models/Payments.js';
import Order from '../models/postgres_models/Commande.js';
import Client from '../models/postgres_models/UserPg.js';

export async function createPayment(paymentData) {
    try {
        const payment = await Payment.create(paymentData);
        return payment;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw new Error('Failed to create payment');
    }
};

export async function getPaymentById(id) {
    try {
        const payment = await Payment.findByPk(id, {
            include: [Order, Client]
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    } catch (error) {
        console.error('Error fetching payment:', error);
        throw new Error('Failed to fetch payment');
    }
};

export async function updatePaymentStatus(id, status) {
    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            throw new Error('Payment not found');
        }
        payment.status = status;
        await payment.save();
        return payment;
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw new Error('Failed to update payment status');
    }
};

export async function listPaymentsByUserId(userId) {
    try {
        const payments = await Payment.findAll({
            where: { userId },
            include: [Order]
        });
        return payments;
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw new Error('Failed to fetch payments');
    }
};

export default {
  createPayment,
  getPaymentById,
  updatePaymentStatus,
  listPaymentsByUserId
};
