import ProductPg from '../models/postgres_models/ProductPg.js';
import ProductMongo from '../models/mongo_models/Product.js';
import denormalizeProduct from './denormalizeProduct.js';

class SyncService {
    /**
     * Synchronise tous les produits de PostgreSQL vers MongoDB
     */
    static async syncAllProducts() {
        try {
            console.log('🔄 Début de la synchronisation complète des produits...');
            
            // Récupérer tous les produits PostgreSQL
            const postgresProducts = await ProductPg.findAll();
            console.log(`📊 ${postgresProducts.length} produits trouvés dans PostgreSQL`);
            
            let syncedCount = 0;
            let errorCount = 0;
            
            for (const product of postgresProducts) {
                try {
                    await denormalizeProduct(product.id);
                    syncedCount++;
                } catch (error) {
                    console.error(`❌ Erreur lors de la synchronisation du produit ${product.id}:`, error.message);
                    errorCount++;
                }
            }
            
            console.log(`✅ Synchronisation terminée: ${syncedCount} produits synchronisés, ${errorCount} erreurs`);
            return { syncedCount, errorCount };
            
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation complète:', error);
            throw error;
        }
    }
    
    /**
     * Nettoie les produits orphelins dans MongoDB (qui n'existent plus dans PostgreSQL)
     */
    static async cleanupOrphanedProducts() {
        try {
            console.log('🧹 Début du nettoyage des produits orphelins...');
            
            // Récupérer tous les produits MongoDB
            const mongoProducts = await ProductMongo.find();
            console.log(`📊 ${mongoProducts.length} produits trouvés dans MongoDB`);
            
            let deletedCount = 0;
            
            for (const mongoProduct of mongoProducts) {
                // Vérifier si le produit existe encore dans PostgreSQL
                const postgresId = mongoProduct.postgres_id;
                if (postgresId) {
                    const postgresProduct = await ProductPg.findByPk(postgresId);
                    if (!postgresProduct) {
                        // Le produit n'existe plus dans PostgreSQL, le supprimer de MongoDB
                        await ProductMongo.findByIdAndDelete(mongoProduct._id);
                        console.log(`🗑️ Produit orphelin supprimé: ${mongoProduct.name} (ID: ${postgresId})`);
                        deletedCount++;
                    }
                }
            }
            
            console.log(`✅ Nettoyage terminé: ${deletedCount} produits orphelins supprimés`);
            return { deletedCount };
            
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage des produits orphelins:', error);
            throw error;
        }
    }
    
    /**
     * Vérifie la cohérence entre les deux bases de données
     */
    static async checkConsistency() {
        try {
            console.log('🔍 Vérification de la cohérence des bases de données...');
            
            const postgresProducts = await ProductPg.findAll();
            const mongoProducts = await ProductMongo.find();
            
            const postgresIds = new Set(postgresProducts.map(p => p.id));
            const mongoPostgresIds = new Set(mongoProducts.map(p => p.postgres_id).filter(id => id));
            
            const missingInMongo = [...postgresIds].filter(id => !mongoPostgresIds.has(id));
            const orphanedInMongo = [...mongoPostgresIds].filter(id => !postgresIds.has(id));
            
            console.log(`📊 Résultats de la vérification:`);
            console.log(`   - Produits PostgreSQL: ${postgresProducts.length}`);
            console.log(`   - Produits MongoDB: ${mongoProducts.length}`);
            console.log(`   - Manquants dans MongoDB: ${missingInMongo.length}`);
            console.log(`   - Orphelins dans MongoDB: ${orphanedInMongo.length}`);
            
            return {
                postgresCount: postgresProducts.length,
                mongoCount: mongoProducts.length,
                missingInMongo,
                orphanedInMongo
            };
            
        } catch (error) {
            console.error('❌ Erreur lors de la vérification de cohérence:', error);
            throw error;
        }
    }
    
    /**
     * Synchronisation complète avec nettoyage
     */
    static async fullSync() {
        try {
            console.log('🚀 Début de la synchronisation complète...');
            
            // Vérifier la cohérence avant
            const beforeCheck = await this.checkConsistency();
            
            // Synchroniser tous les produits
            const syncResult = await this.syncAllProducts();
            
            // Nettoyer les produits orphelins
            const cleanupResult = await this.cleanupOrphanedProducts();
            
            // Vérifier la cohérence après
            const afterCheck = await this.checkConsistency();
            
            console.log('✅ Synchronisation complète terminée');
            
            return {
                before: beforeCheck,
                after: afterCheck,
                sync: syncResult,
                cleanup: cleanupResult
            };
            
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation complète:', error);
            throw error;
        }
    }
}

export default SyncService; 