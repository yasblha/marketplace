import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('PostgreSQL Configuration:');
console.log('Host:', process.env.POSTGRES_HOST || 'postgres (default)');
console.log('Port:', process.env.POSTGRES_PORT || '5432 (default)');
console.log('User:', process.env.POSTGRES_USER || 'user (default)');
console.log('DB:', process.env.POSTGRESDB_DATABASE || 'marketplace (default)');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'admin',
    database: process.env.POSTGRESDB_DATABASE || 'marketplace',
    logging: (msg) => console.log(`[Sequelize] ${msg}`),
    define: {
        timestamps: false,
        underscored: true,
        freezeTableName: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    retry: {
        max: 3,
        timeout: 30000
    }
});

async function testPostgresConnection() {
    try {
        console.log('Testing PostgreSQL connection...');
        await sequelize.authenticate();
        console.log('✅ Connection to PostgreSQL has been established successfully.');
        
        // Vérifier les tables existantes
        const [tables] = await sequelize.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
        );
        console.log('📋 Existing tables:', tables.map(t => t.table_name).join(', '));
        
    } catch (error) {
        console.error('❌ Unable to connect to the PostgreSQL database:', error.message);
        if (error.original) {
            console.error('Original error:', error.original);
            console.error('Error code:', error.original.code);
            console.error('Error errno:', error.parent.errno);
        }
    }
}

testPostgresConnection();

export default sequelize;