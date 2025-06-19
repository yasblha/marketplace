import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

console.log('Database Configuration:');
console.log('Host:', process.env.POSTGRES_HOST || 'postgres (default)');
console.log('Port:', process.env.POSTGRES_PORT || '5432 (default)');
console.log('User:', process.env.POSTGRES_USER || 'user (default)');
console.log('DB:', process.env.POSTGRESDB_DATABASE || 'marketplace (default)');

const sequelizeInstance = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'admin',
    database: process.env.POSTGRESDB_DATABASE || 'marketplace',
    logging: console.log, // Active les logs SQL
    define: {
        timestamps: false, // Désactive les timestamps par défaut
        underscored: true,
        freezeTableName: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Tester la connexion
async function testConnection() {
    try {
        await sequelizeInstance.authenticate();
        console.log('Connection to the database has been established successfully.');
        // Afficher les tables existantes
        const [results] = await sequelizeInstance.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log('Existing tables:', results.map(r => r.table_name));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

export { sequelizeInstance };