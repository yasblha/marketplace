import paymentService from '../services/paymentService.js';

export async function createPayment(req, res, next) {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

export async function getPayment(req, res, next) {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        res.status(200).json(payment);
    } catch (error) {
        next(error);
    }
};

export async function updatePaymentStatus(req, res, next) {
    try {
        const payment = await paymentService.updatePaymentStatus(req.params.id, req.body.status);
        res.status(200).json(payment);
    } catch (error) {
        next(error);
    }
};

export async function listPaymentsByUser(req, res, next) {
    try {
        const payments = await paymentService.listPaymentsByUserId(req.params.userId);
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
};

export async function processWebhook(req, res, next) {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

export default {
    createPayment,
    getPayment,
    updatePaymentStatus,
    listPaymentsByUser,
    processWebhook
};
