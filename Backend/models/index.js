import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import denormalizeProduct from '../services/denormalizeProduct.js';
import ProductMongo from './mongo_models/Product.js';
import { sequelizeInstance } from '../config/sequelizeConfig.js';

// Importation explicite de chaque modèle PostgreSQL migré
import Alert from './postgres_models/Alert.js';
// import CategoryPg from './postgres_models/CategoryPg.js'; // Désactivé car le modèle n'existe pas
import Commande from './postgres_models/Commande.js';
import DetailsCommande from './postgres_models/DetailsCommande.js';
import Favorite from './postgres_models/Favorite.js';
import Media from './postgres_models/Media.js';
import Menu from './postgres_models/Menu.js';
import Panier from './postgres_models/Panier.js';
import Payments from './postgres_models/Payments.js';
import ProductPg from './postgres_models/ProductPg.js';
import Returns from './postgres_models/Returns.js';
import UserPg from './postgres_models/UserPg.js';
import AdresseLivraison from './postgres_models/AdresseLivraison.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Remplacement de l'import JSON par lecture manuelle
const configPath = path.join(__dirname, '../config/config.json');
const rawConfig = fs.readFileSync(configPath);
const config = JSON.parse(rawConfig)[env];

const db = {};

try {
    console.log('Testing database connection...');
    await sequelizeInstance.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Vérifier les tables existantes
    const [tables] = await sequelizeInstance.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    console.log('📋 Existing tables:', tables.map(t => t.table_name).join(', '));
    
} catch (err) {
    console.error('❌ Unable to connect to the database:', err.message);
    if (err.original) {
        console.error('Original error:', err.original);
    }
    process.exit(1);
}

console.log('\n🔧 Initializing models...');

// En supposant que les imports ci-dessus fournissent des classes de modèle non initialisées, nous les initialisons ici.
// Adaptez cette partie si vos modèles sont définis différemment.
try {
    Alert.init(Alert.getAttributes(), { 
        sequelize: sequelizeInstance, 
        modelName: 'Alert', 
        tableName: 'Alerts',
        timestamps: true
    });
    console.log('✅ Alert model initialized');
} catch (error) {
    console.error('❌ Error initializing Alert model:', error.message);
}
// Fonction utilitaire pour initialiser un modèle avec gestion d'erreur
const initModel = (model, modelName, tableName, options = {}) => {
    try {
        // Récupérer les options du modèle, y compris les timestamps
        const modelOptions = model.getOptions ? model.getOptions() : {};
        
        model.init(model.getAttributes(), { 
            sequelize: sequelizeInstance, 
            modelName, 
            tableName,
            // Utiliser les timestamps du modèle s'ils sont définis, sinon false par défaut
            timestamps: modelOptions.timestamps !== undefined ? modelOptions.timestamps : false,
            // Conserver createdAt et updatedAt du modèle s'ils sont définis
            createdAt: modelOptions.createdAt !== undefined ? modelOptions.createdAt : false,
            updatedAt: modelOptions.updatedAt !== undefined ? modelOptions.updatedAt : false,
            ...options
        });
        console.log(`✅ ${modelName} model initialized`);
        return true;
    } catch (error) {
        console.error(`❌ Error initializing ${modelName} model:`, error.message);
        if (error.original) {
            console.error('Original error:', error.original);
        }
        return false;
    }
};

// Initialisation de tous les modèles
initModel(Commande, 'Commande', 'Orders');
initModel(DetailsCommande, 'DetailsCommande', 'OrderDetails');
initModel(Favorite, 'Favorite', 'Favorites');
initModel(Media, 'Media', 'Media');
initModel(Menu, 'Menu', 'Menus');
initModel(Panier, 'Panier', 'Cart');
initModel(Payments, 'Payments', 'Payments');
initModel(ProductPg, 'ProductPg', 'Product');
initModel(Returns, 'Returns', 'Returns');
initModel(UserPg, 'UserPg', 'Clients');
initModel(AdresseLivraison, 'AdresseLivraison', 'DeliveryAddresses');

// Attribuer les modèles initialisés à l'objet db
db.Alert = Alert;
//db.CategoryPg = CategoryPg;
db.Commande = Commande;
db.DetailsCommande = DetailsCommande;
db.Favorite = Favorite;
db.Media = Media;
db.Menu = Menu;
db.Panier = Panier;
db.Payments = Payments;
db.ProductPg = ProductPg;
db.Returns = Returns;
db.UserPg = UserPg;
db.AdresseLivraison = AdresseLivraison;

// Définir les associations
db.UserPg.hasMany(db.Commande, { 
    foreignKey: 'userId',
    as: 'commandes'
});
db.Commande.belongsTo(db.UserPg, { 
    foreignKey: 'userId',
    as: 'user'
});

db.Commande.hasMany(db.DetailsCommande, { 
    foreignKey: 'orderId',
    as: 'details'
});
db.DetailsCommande.belongsTo(db.Commande, { 
    foreignKey: 'orderId',
    as: 'commande'
});

db.ProductPg.hasMany(db.DetailsCommande, { 
    foreignKey: 'productId',
    as: 'detailsCommandes'
});
db.DetailsCommande.belongsTo(db.ProductPg, { 
    foreignKey: 'productId',
    as: 'produit'
});

db.UserPg.hasMany(db.Favorite, { foreignKey: 'userid' });
db.Favorite.belongsTo(db.UserPg, { foreignKey: 'userid' });

db.UserPg.hasMany(db.AdresseLivraison, { foreignKey: 'userId' });
db.AdresseLivraison.belongsTo(db.UserPg, { foreignKey: 'userId' });

db.ProductPg.hasMany(db.Media, { foreignKey: 'productId' });
db.Media.belongsTo(db.ProductPg, { foreignKey: 'productId' });


db.UserPg.hasMany(db.Panier, { foreignKey: 'userid' });
db.Panier.belongsTo(db.UserPg, { foreignKey: 'userid' });

db.ProductPg.hasMany(db.Panier, { foreignKey: 'productid' });
db.Panier.belongsTo(db.ProductPg, { foreignKey: 'productid' });

db.Commande.hasMany(db.Payments, { foreignKey: 'orderId' });
db.Payments.belongsTo(db.Commande, { foreignKey: 'orderId' });

db.UserPg.hasMany(db.Payments, { foreignKey: 'userId' });
db.Payments.belongsTo(db.UserPg, { foreignKey: 'userId' });

db.Commande.hasMany(db.Returns, { foreignKey: 'orderId' });
db.Returns.belongsTo(db.Commande, { foreignKey: 'orderId' });

db.ProductPg.hasMany(db.Returns, { foreignKey: 'productId' });
db.Returns.belongsTo(db.ProductPg, { foreignKey: 'productId' });

db.UserPg.hasMany(db.Returns, { foreignKey: 'userId' });
db.Returns.belongsTo(db.UserPg, { foreignKey: 'userId' });

db.UserPg.hasMany(db.Alert, { foreignKey: 'user_id' });
db.Alert.belongsTo(db.UserPg, { foreignKey: 'user_id' });

db.ProductPg.hasMany(db.Alert, { foreignKey: 'product_id' });
db.Alert.belongsTo(db.ProductPg, { foreignKey: 'product_id' });

// Désactivé car le modèle CategoryPg n'existe pas
// if (db.CategoryPg) {
//   db.CategoryPg.hasMany(db.CategoryPg, {
//     as: 'Children',
//     foreignKey: 'parent_id'
//   });
//   db.CategoryPg.belongsTo(db.CategoryPg, {
//     as: 'Parent',
//     foreignKey: 'parent_id'
//   });
// }

// Exemple de hook pour ProductPg
db.ProductPg.addHook('afterCreate', async (product, options) => {
    await denormalizeProduct(product.id);
});
db.ProductPg.addHook('afterUpdate', async (product, options) => {
    await denormalizeProduct(product.id);
});
db.ProductPg.addHook('afterDestroy', async (product, options) => {
    await ProductMongo.findByIdAndDelete(product.id);
});

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

export { sequelizeInstance };
export default db;
