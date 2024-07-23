const mongoose = require('mongoose');

module.exports = {
    connect: jest.fn().mockImplementation(() => {
        console.log('Mocked MongoDB connection');
        return {
            connection: {
                readyState: 1,  // État connecté
                close: jest.fn(),
            }
        };
    }),
};
