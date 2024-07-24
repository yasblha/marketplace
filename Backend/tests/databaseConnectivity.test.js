require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

describe('Database Connectivity', () => {
    test('should connect to PostgreSQL', async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection to PostgreSQL has been established successfully.');
            expect(true).toBe(true);
        } catch (error) {
            console.error('Unable to connect to the PostgreSQL database:', error);
            throw new Error('PostgreSQL connection failed');
        } finally {
            await sequelize.close();
        }
    });
});
