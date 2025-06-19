import returnService from '../services/RetourService.js';

async function createReturn(req, res, next) {
    try {
        const returnRecord = await returnService.createReturn(req.body);
        res.status(201).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

async function getReturn(req, res, next) {
    try {
        const returnRecord = await returnService.getReturnById(req.params.id);
        res.status(200).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

async function updateReturnStatus(req, res, next) {
    try {
        const returnRecord = await returnService.updateReturnStatus(req.params.id, req.body.status);
        res.status(200).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

async function listReturnsByUser(req, res, next) {
    try {
        const returns = await returnService.listReturnsByUserId(req.params.userId);
        res.status(200).json(returns);
    } catch (error) {
        next(error);
    }
};

async function rejectReturn(req, res, next) {
    try {
        const returnRecord = await returnService.getReturnById(req.params.id);
        res.status(200).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

async function approveReturn(req, res, next) {
    try {
        const returnRecord = await returnService.updateReturnStatus(req.params.id, req.body.status);
        res.status(200).json(returnRecord);
    } catch (error) {
        next(error);
    }
};

export default {
  createReturn,
  getReturn,
  updateReturnStatus,
  listReturnsByUser,
  approveReturn,
  rejectReturn
};
