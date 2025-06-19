import { sequelizeInstance } from './models/index.js';

export const syncDatabase = async () => {
    console.log('\n🔄 Starting database synchronization...');
    
    try {
        // Options de synchronisation
        const syncOptions = {
            alter: {
                drop: false,
                add: true,
            },
            force: false,
            logging: (msg) => console.log(`[Sequelize Sync] ${msg}`),
        };

        console.log('🔍 Synchronization options:', JSON.stringify(syncOptions, null, 2));
        
        // Vérifier la connexion d'abord
        await sequelizeInstance.authenticate();
        console.log('✅ Database connection verified');
        
        // Obtenir la liste des modèles
        const modelNames = Object.keys(sequelizeInstance.models);
        console.log('📋 Models to sync:', modelNames.join(', '));
        
        // Synchroniser chaque modèle individuellement pour un meilleur débogage
        for (const modelName of modelNames) {
            try {
                console.log(`\n🔄 Syncing model: ${modelName}`);
                const model = sequelizeInstance.models[modelName];
                await model.sync(syncOptions);
                console.log(`✅ Successfully synced model: ${modelName}`);
            } catch (modelError) {
                console.error(`❌ Error syncing model ${modelName}:`, modelError.message);
                if (modelError.original) {
                    console.error('Original error:', modelError.original);
                }
            }
        }
        
        console.log('\n✅ Database synchronization completed successfully');
        return true;
        
    } catch (error) {
        console.error('\n❌ Unable to synchronize the database:');
        console.error('Error message:', error.message);
        
        if (error.original) {
            console.error('Original error:', error.original);
            console.error('Error code:', error.original.code);
            console.error('SQL:', error.original.sql);
        }
        
        if (error.errors) {
            console.error('Validation errors:', error.errors.map(e => ({
                message: e.message,
                type: e.type,
                path: e.path,
                value: e.value
            })));
        }
        
        throw error;
    }
};
