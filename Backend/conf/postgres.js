const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRESDB_USER,
    host: process.env.POSTGRESDB_HOST,
    database: process.env.POSTGRESDB_DATABASE,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    port: process.env.POSTGRESDB_PORT || 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

module.exports = pool;
