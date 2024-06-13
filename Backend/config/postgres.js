const { Pool } = require('pg');

const pool = new Pool({
    user: 'user',
    password: 'admin',
    host: 'postgres',
    port: 5432,
    database: 'marketplace',
})


pool.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        pool.query('SELECT * FROM "Order"', (err, result) => {
            if (err) {
                console.error('Error executing query', err);
            } else {
                console.log('Query result:', result.rows);
            }

            // Close the connection when done
            pool
                .end()
                .then(() => {
                    console.log('Connection to PostgreSQL closed');
                })
                .catch((err) => {
                    console.error('Error closing connection', err);
                });
        });

})
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });

module.exports = {
    query: (text, params) => pool.query(text, params)
};