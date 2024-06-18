const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'postgres',
    username: 'user',
    password: 'admin',
    database: 'marketplace',
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();


module.exports = sequelize;

