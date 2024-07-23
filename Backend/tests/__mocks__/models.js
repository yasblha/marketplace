const { DataTypes, Op } = require('sequelize');

const mockModel = {
    sync: jest.fn().mockResolvedValue(true),
    belongsToMany: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
};

const sequelizeMock = {
    define: jest.fn().mockReturnValue(mockModel),
    authenticate: jest.fn().mockResolvedValue(true),
    DataTypes,
    Op
};

module.exports = sequelizeMock;
