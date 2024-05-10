const { Client } = require('pg');

const client = new Client({
    user: 'user',
    password: 'admin',
    host: 'postgres',
    port: 5432,
    database: 'marketplace',
})

module.exports = {
    query: (text, params) => pool.query(text, params)
};
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });